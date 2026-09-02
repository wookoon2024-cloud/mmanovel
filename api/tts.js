const crypto = require('crypto');
const WebSocket = require('ws');

function uuidv4() {
  return crypto.randomUUID().replace(/-/g, '');
}

// 화자별 Microsoft Neural 남성 보이스 매핑
const VOICE_MAP = {
  'himchan': { voice: 'ko-KR-HyunsuNeural', rate: '+8%', pitch: '+6Hz' }, // 활기찬 가이드 현수
  'minwoo': { voice: 'ko-KR-InJoonNeural', rate: '+0%', pitch: '-2Hz' }, // 청년 주인공 인준
  'doctor': { voice: 'ko-KR-BongJinNeural', rate: '-4%', pitch: '-8Hz' }, // 진중한 전문의/군의관 봉진
  'adjudicator': { voice: 'ko-KR-GookMinNeural', rate: '-8%', pitch: '-14Hz' }, // 중후한 수석판정관 국민
  'counselor': { voice: 'ko-KR-InJoonNeural', rate: '-2%', pitch: '-4Hz' }, // 지적인 상담관
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
  if (spk.includes('김민우') || spk.includes('민우') || spk.includes('minwoo')) {
    return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.minwoo;
  }
  if (spk.includes('수석판정관') || spk.includes('판정관') || spk.includes('adjudicator')) {
    return isEn ? VOICE_MAP.en_adjudicator : VOICE_MAP.adjudicator;
  }
  if (spk.includes('정형외과') || spk.includes('전문의') || spk.includes('의무관') || spk.includes('doctor') || spk.includes('의사')) {
    return isEn ? VOICE_MAP.en_doctor : VOICE_MAP.doctor;
  }
  if (spk.includes('상담관') || spk.includes('counselor')) {
    return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.counselor;
  }
  return isEn ? VOICE_MAP.en_minwoo : VOICE_MAP.minwoo;
}

async function synthesizeEdgeTTS(text, voiceConfig) {
  return new Promise((resolve, reject) => {
    const connId = uuidv4();
    const WSS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=' + connId;

    const ws = new WebSocket(WSS_URL, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const audioChunks = [];
    const dateStr = new Date().toISOString();
    let isCompleted = false;

    const timeout = setTimeout(() => {
      if (!isCompleted) {
        try { ws.close(); } catch(e) {}
        if (audioChunks.length > 0) {
          resolve(Buffer.concat(audioChunks));
        } else {
          reject(new Error('Edge TTS Timeout'));
        }
      }
    }, 6000);

    ws.on('open', () => {
      const configMsg = 'X-Timestamp:' + dateStr + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}';
      ws.send(configMsg);

      const reqId = uuidv4();
      const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ko-KR'><voice name='" + voiceConfig.voice + "'><prosody pitch='" + voiceConfig.pitch + "' rate='" + voiceConfig.rate + "'>" + text + "</prosody></voice></speak>";
      const ssmlMsg = 'X-RequestId:' + reqId + '\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:' + dateStr + 'Z\r\nPath:ssml\r\n\r\n' + ssml;
      ws.send(ssmlMsg);
    });

    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        const textMsg = data.toString('utf8');
        if (textMsg.includes('Path:turn.end')) {
          isCompleted = true;
          clearTimeout(timeout);
          try { ws.close(); } catch(e) {}
          resolve(Buffer.concat(audioChunks));
        }
      } else {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          if (buf.length > headerLen + 2) {
            const audioPart = buf.subarray(headerLen + 2);
            audioChunks.push(audioPart);
          }
        }
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      if (audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      } else {
        reject(err);
      }
    });
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { speaker = '김민우', text = '', lang = 'ko' } = req.query;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  const cleanText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[|\]|\{|\}|\(|\)|✓|➔|▶|🏢|💡|📋|🌐|🎖️|•|※/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  try {
    const voiceConfig = getVoiceConfig(speaker, lang);
    const audioBuffer = await synthesizeEdgeTTS(cleanText, voiceConfig);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(audioBuffer);
  } catch (err) {
    console.error('Edge TTS Error:', err);
    return res.status(500).json({ error: 'TTS Synthesis failed', details: err.message });
  }
};
