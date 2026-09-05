const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(process.cwd(), 'cache', 'tts');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// In-flight deduplication map: cacheKey -> Promise<string>
const pendingPromises = new Map();

// 화자별 오픈소스 Microsoft Neural 남성/캐릭터 보이스 설정
const VOICE_MAP = {
  'himchan': { voice: 'ko-KR-HyunsuMultilingualNeural', rate: '+5%', pitch: '+3Hz' }, // 활기찬 가이드 청년 현수
  'minwoo': { voice: 'ko-KR-InJoonNeural', rate: '+0%', pitch: '-2Hz' },               // 20대 대학생 주인공 인준
  'doctor': { voice: 'ko-KR-InJoonNeural', rate: '-3%', pitch: '-6Hz' },               // 차분한 전문의/군의관
  'adjudicator': { voice: 'ko-KR-InJoonNeural', rate: '-7%', pitch: '-12Hz' },         // 묵직한 50대 수석판정관
  'counselor': { voice: 'ko-KR-InJoonNeural', rate: '-2%', pitch: '-4Hz' },           // 신뢰감 있는 상담관
  
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

function synthesizeSpeech(text, voiceConfig) {
  const { voice, rate, pitch } = voiceConfig;
  const key = crypto.createHash('md5').update(`${voice}:${rate}:${pitch}:${text}`).digest('hex');
  const targetFile = path.join(CACHE_DIR, `${key}.mp3`);

  // 1. 이미 생성된 캐시 파일이 있으면 즉시 반환
  if (fs.existsSync(targetFile)) {
    return Promise.resolve(targetFile);
  }

  // 2. 동일한 문장이 현재 합성 중이면 해당 Promise 재사용 (중복 실행 방지)
  if (pendingPromises.has(key)) {
    return pendingPromises.get(key);
  }

  const tmpFile = path.join(CACHE_DIR, `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
  const promise = new Promise((resolve, reject) => {
    const args = [
      '-m', 'edge_tts',
      `--voice=${voice}`,
      `--rate=${rate}`,
      `--pitch=${pitch}`,
      `--text=${text}`,
      `--write-media=${tmpFile}`
    ];

    execFile('python', args, { timeout: 10000 }, (err, stdout, stderr) => {
      pendingPromises.delete(key);
      if (err) {
        try { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); } catch(e) {}
        return reject(new Error(`edge-tts failed: ${stderr || err.message}`));
      }
      try {
        fs.renameSync(tmpFile, targetFile);
        resolve(targetFile);
      } catch(e) {
        if (fs.existsSync(targetFile)) {
          resolve(targetFile);
        } else {
          reject(e);
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
    console.error('[OpenSource TTS Error]:', err.message);
    return res.status(500).json({ error: 'TTS Synthesis failed', details: err.message });
  }
};
