const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const WebSocket = require('ws');

const CACHE_DIR = process.env.VERCEL ? path.join('/tmp', 'tts') : path.join(process.cwd(), 'cache', 'tts');
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (e) {}

// In-flight deduplication map: cacheKey -> Promise<string>
const pendingPromises = new Map();

// 화자별 Microsoft Neural 남성/캐릭터 보이스 설정
const VOICE_MAP = {
  'himchan': { voice: 'ko-KR-HyunsuMultilingualNeural', rate: '+5%', pitch: '+3Hz' }, // 활기찬 가이드 청년 현수
  'minwoo': { voice: 'ko-KR-InJoonNeural', rate: '+0%', pitch: '-2Hz' },               // 20대 대학생 주인공 인준 (남성)
  'doctor': { voice: 'ko-KR-InJoonNeural', rate: '-3%', pitch: '-6Hz' },               // 차분한 전문의/군의관 (남성)
  'adjudicator': { voice: 'ko-KR-InJoonNeural', rate: '-7%', pitch: '-12Hz' },         // 묵직한 50대 수석판정관 (남성)
  'counselor': { voice: 'ko-KR-InJoonNeural', rate: '-2%', pitch: '-4Hz' },           // 신뢰감 있는 상담관 (남성)
  
  // 영어 모드 지원
  'en_himchan': { voice: 'en-US-GuyNeural', rate: '+5%', pitch: '+4Hz' },
  'en_minwoo': { voice: 'en-US-ChristopherNeural', rate: '+0%', pitch: '-2Hz' },
  'en_doctor': { voice: 'en-US-EricNeural', rate: '-4%', pitch: '-6Hz' },
  'en_adjudicator': { voice: 'en-US-RogerNeural', rate: '-8%', pitch: '-12Hz' }
};

function getVoiceConfig(speaker = '', lang = 'ko') {
  const spk = speaker.toLowerCase();
  const isEn = (lang === 'en');

  if (spk.includes('힘찬이') || spk.includes('himchan')) {
    return isEn ? VOICE_MAP.en_himchan : VOICE_MAP.himchan;
  }
  if (spk.includes('김민우') || spk.includes('민우') || spk.includes('minwoo') || spk.includes('주인공') || spk.includes('예비역')) {
    return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.minwoo;
  }
  if (spk.includes('수석판정관') || spk.includes('판정관') || spk.includes('adjudicator')) {
    return isEn ? VOICE_MAP.en_adjudicator : VOICE_MAP.adjudicator;
  }
  if (spk.includes('정형외과') || spk.includes('전문의') || spk.includes('의무관') || spk.includes('doctor') || spk.includes('의사') || spk.includes('임상병리사') || spk.includes('심리검사관')) {
    return isEn ? VOICE_MAP.en_doctor : VOICE_MAP.doctor;
  }
  if (spk.includes('상담관') || spk.includes('counselor')) {
    return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.counselor;
  }
  return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.minwoo;
}

function cleanDialogueText(text = '') {
  return text
    .replace(/\((일|월|화|수|목|금|토)\)/g, '$1요일')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[|\]|\{|\}|\(|\)|✓|➔|▶|🏢|💡|📋|🌐|🎖️|•|※|①|②|③|④|⚠️|📸/g, ' ')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(unsafe = '') {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Edge TTS WebSocket DRM 토큰 및 인증 서명 생성기
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const SEC_MS_GEC_VERSION = '1-143.0.3650.75';
const WIN_EPOCH = 11644473600;

function generateSecMsGec() {
  let ticks = Date.now() / 1000;
  ticks += WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= 1e7;
  const strToHash = `${ticks.toFixed(0)}${TRUSTED_CLIENT_TOKEN}`;
  return crypto.createHash('sha256').update(strToHash, 'ascii').digest('hex').toUpperCase();
}

function generateMuid() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

function uuidv4() {
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * 순수 Node.js WebSocket을 이용해 Microsoft Edge Neural TTS API와 직접 통신
 * (Python이나 외부 바이너리 종속성 완전 제거 -> Vercel Serverless 완벽 호환)
 */
function synthesizeSpeech(text, voiceConfig) {
  const { voice, rate, pitch } = voiceConfig;
  const key = crypto.createHash('md5').update(`${voice}:${rate}:${pitch}:${text}`).digest('hex');
  const targetFile = path.join(CACHE_DIR, `${key}.mp3`);

  // 1. 이미 디스크에 캐싱된 오디오 파일이 있으면 즉시 반환
  if (fs.existsSync(targetFile)) {
    return Promise.resolve(targetFile);
  }

  // 2. 동일한 텍스트/화자 요청이 진행 중이면 기존 Promise 공유 (중복 호출 방지)
  if (pendingPromises.has(key)) {
    return pendingPromises.get(key);
  }

  const tmpFile = path.join(CACHE_DIR, `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);

  const promise = new Promise((resolve, reject) => {
    const connectionId = uuidv4();
    const secMsGec = generateSecMsGec();
    const muid = generateMuid();
    const wssUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connectionId}`;

    const ws = new WebSocket(wssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': `muid=${muid};`
      },
      handshakeTimeout: 7000
    });

    const audioChunks = [];
    let isSettled = false;

    const cleanupAndReject = (err) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeoutTimer);
      pendingPromises.delete(key);
      try { ws.terminate(); } catch (e) {}
      try { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); } catch (e) {}
      reject(err);
    };

    const cleanupAndResolve = (filePath) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeoutTimer);
      pendingPromises.delete(key);
      try { ws.close(); } catch (e) {}
      resolve(filePath);
    };

    // 타임아웃 방어 (12초)
    const timeoutTimer = setTimeout(() => {
      cleanupAndReject(new Error('Edge TTS WebSocket synthesis timed out'));
    }, 12000);

    ws.on('open', () => {
      try {
        const dateStr = new Date().toISOString();
        // 1. 오디오 포맷 및 클라이언트 컨텍스트 전송
        const configMsg = 'X-Timestamp:' + dateStr + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}';
        ws.send(configMsg);

        // 2. SSML 음성 합성 요청 전송
        const reqId = uuidv4();
        const langCode = voice.startsWith('en-') ? 'en-US' : 'ko-KR';
        const escapedText = escapeXml(text);
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${langCode}'><voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}'>${escapedText}</prosody></voice></speak>`;
        const ssmlMsg = 'X-RequestId:' + reqId + '\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:' + dateStr + 'Z\r\nPath:ssml\r\n\r\n' + ssml;
        ws.send(ssmlMsg);
      } catch (err) {
        cleanupAndReject(err);
      }
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        const textMsg = data.toString('utf8');
        // 합성 종료 시점 감지
        if (textMsg.includes('Path:turn.end')) {
          const totalAudio = Buffer.concat(audioChunks);
          if (totalAudio.length === 0) {
            cleanupAndReject(new Error('Edge TTS returned 0 audio bytes'));
            return;
          }

          fs.writeFile(tmpFile, totalAudio, (writeErr) => {
            if (writeErr) {
              cleanupAndReject(writeErr);
              return;
            }
            fs.rename(tmpFile, targetFile, (renameErr) => {
              if (renameErr && !fs.existsSync(targetFile)) {
                cleanupAndReject(renameErr);
              } else {
                cleanupAndResolve(targetFile);
              }
            });
          });
        }
      } else {
        // 바이너리 오디오 청크 파싱 (2바이트 헤더 길이 + 헤더 내용 + 실제 MP3 바이너리 바이트)
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          if (buf.length > headerLen + 2) {
            audioChunks.push(buf.subarray(headerLen + 2));
          }
        }
      }
    });

    ws.on('error', (err) => {
      cleanupAndReject(new Error(`Edge TTS WebSocket error: ${err.message}`));
    });

    ws.on('close', (code, reason) => {
      if (!isSettled) {
        if (audioChunks.length > 0) {
          const totalAudio = Buffer.concat(audioChunks);
          fs.writeFile(tmpFile, totalAudio, (wErr) => {
            if (wErr) return cleanupAndReject(wErr);
            fs.rename(tmpFile, targetFile, (rErr) => {
              if (rErr && !fs.existsSync(targetFile)) return cleanupAndReject(rErr);
              cleanupAndResolve(targetFile);
            });
          });
        } else {
          cleanupAndReject(new Error(`Edge TTS WebSocket closed prematurely (code: ${code}, reason: ${reason || 'none'})`));
        }
      }
    });
  });

  pendingPromises.set(key, promise);
  return promise;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { speaker = '김민우', text = '', lang = 'ko' } = (req.method === 'POST' ? (req.body || {}) : (req.query || {}));

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  const cleanText = cleanDialogueText(text);
  if (!cleanText) {
    return res.status(400).json({ error: 'Empty text after cleaning' });
  }

  try {
    const voiceConfig = getVoiceConfig(speaker, lang);
    const audioFilePath = await synthesizeSpeech(cleanText, voiceConfig);

    const stat = fs.statSync(audioFilePath);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Accept-Ranges': 'bytes'
    });

    const readStream = fs.createReadStream(audioFilePath);
    readStream.pipe(res);
  } catch (err) {
    console.error('[Edge TTS WebSocket Error]:', err.message);
    return res.status(500).json({ error: 'TTS Synthesis failed', details: err.message });
  }
};
