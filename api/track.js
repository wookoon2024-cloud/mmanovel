const fs = require('fs');
const path = require('path');

// In-memory fallback cache
if (!global.__MMA_SESSIONS__) {
  global.__MMA_SESSIONS__ = new Map();
  global.__MMA_HISTORY__ = [];
  global.__MMA_TOTAL_PV__ = 0;
}

const SESSIONS_FILE = path.join('/tmp', 'mmanovel_sessions.json');
const HISTORY_FILE = path.join('/tmp', 'mmanovel_history.json');

function loadTmpStorage() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(s => {
          if (Date.now() - s.lastSeen < 45000) {
            global.__MMA_SESSIONS__.set(s.sessionId, s);
          }
        });
      }
    }
  } catch (e) {}

  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const hist = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      if (Array.isArray(hist)) {
        global.__MMA_HISTORY__ = hist.slice(-200);
      }
    }
  } catch (e) {}
}

function saveTmpStorage() {
  try {
    const list = Array.from(global.__MMA_SESSIONS__.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(global.__MMA_HISTORY__.slice(-200)), 'utf8');
  } catch (e) {}
}

loadTmpStorage();

function parseUserAgent(ua = '') {
  const uaLower = ua.toLowerCase();
  let os = 'Unknown OS';
  if (uaLower.includes('windows')) os = 'Windows';
  else if (uaLower.includes('iphone')) os = 'iOS (iPhone)';
  else if (uaLower.includes('ipad')) os = 'iPadOS';
  else if (uaLower.includes('macintosh') || uaLower.includes('mac os')) os = 'macOS';
  else if (uaLower.includes('android')) os = 'Android';
  else if (uaLower.includes('linux')) os = 'Linux';

  let browser = 'Unknown Browser';
  if (uaLower.includes('whale')) browser = 'Naver Whale';
  else if (uaLower.includes('samsungbrowser')) browser = 'Samsung Internet';
  else if (uaLower.includes('kakaotalk')) browser = 'KakaoTalk';
  else if (uaLower.includes('naver')) browser = 'Naver App';
  else if (uaLower.includes('edg/')) browser = 'Microsoft Edge';
  else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) browser = 'Google Chrome';
  else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'Apple Safari';
  else if (uaLower.includes('firefox')) browser = 'Mozilla Firefox';

  let device = 'Desktop';
  if (/mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(uaLower)) {
    device = 'Mobile';
  } else if (/ipad|tablet/i.test(uaLower)) {
    device = 'Tablet';
  } else if (uaLower.includes('android')) {
    device = uaLower.includes('tablet') ? 'Tablet' : 'Mobile';
  }

  return { os, browser, device };
}

function extractClientIp(req) {
  let ip = '';
  // Vercel / Cloudflare / Proxy 헤더 우선 확인
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const list = xForwardedFor.split(',');
    if (list.length > 0 && list[0].trim()) {
      ip = list[0].trim();
    }
  }
  if (!ip && req.headers['x-real-ip']) ip = req.headers['x-real-ip'].trim();
  if (!ip && req.headers['cf-connecting-ip']) ip = req.headers['cf-connecting-ip'].trim();
  if (!ip && req.headers['x-client-ip']) ip = req.headers['x-client-ip'].trim();
  if (!ip && req.socket && req.socket.remoteAddress) ip = req.socket.remoteAddress;
  if (!ip && req.connection && req.connection.remoteAddress) ip = req.connection.remoteAddress;
  if (!ip || ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';

  // IPv6 mapped IPv4 접두사(::ffff:) 정리
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  if (ip === '::1') ip = '127.0.0.1';
  return ip;
}

function maskIp(ip = '') {
  if (!ip) return '127.0.0.1';
  if (ip.startsWith('::ffff:')) ip = ip.substring(7);
  if (ip === '127.0.0.1' || ip === '::1') return '127.0.0.1';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) return parts[0] + '.' + parts[1] + '.*.*';
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 2).join(':') + ':****';
  }
  return ip;
}

// Vercel KV / Upstash Redis REST 지원 (환경변수 또는 연결된 클라우드 DB 기본값)
const DEFAULT_UPSTASH_URL = 'https://enabling-tortoise-158995.upstash.io';
const DEFAULT_UPSTASH_TOKEN = 'gQAAAAAAAm0TAAIgcDI3ZDlmY2M0MzI5N2Q0MzgwOTI5YmRhYjZjZjdjOTUyOA';

async function sendToUpstash(cmd, ...args) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || DEFAULT_UPSTASH_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || DEFAULT_UPSTASH_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([cmd, ...args])
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let body = {};
  if (req.method === 'POST') {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } else {
    body = req.query || {};
  }

  const sessionId = body.sessionId || req.headers['x-session-id'] || ('anon_' + Math.random().toString(36).substring(2, 9));
  const visitorId = body.visitorId || 'v_' + Math.random().toString(36).substring(2, 9);
  const eventType = body.eventType || 'heartbeat';
  const sceneIdx = body.sceneIdx !== undefined ? body.sceneIdx : 'lobby';
  const sceneTitle = body.sceneTitle || (sceneIdx === 'lobby' || String(sceneIdx).startsWith('lobby') ? '메인 로비 (시나리오 선택 중)' : 'SCENE 0: 통지서 확인');
  const lang = body.lang || 'ko';
  const referrer = body.referrer || '';
  const screen = body.screen || '';

  // 실제 클라이언트 접속 PC IP 및 Vercel 지리정보 추출
  const rawIp = extractClientIp(req);
  const country = req.headers['x-vercel-ip-country'] || 'KR';
  let city = '서울';
  try {
    city = decodeURIComponent(req.headers['x-vercel-ip-city'] || 'Seoul');
    if (city.toLowerCase() === 'seoul') city = '서울특별시';
  } catch (e) {}
  const region = req.headers['x-vercel-ip-country-region'] || '';
  const userAgent = req.headers['user-agent'] || '';
  const parsed = parseUserAgent(userAgent);
  const clientDevice = body.device;
  // 클라이언트가 명시적으로 보고한 기기(Mobile/Tablet) 최우선 신뢰
  const finalDevice = (clientDevice === 'Mobile' || clientDevice === 'Tablet')
    ? clientDevice
    : (parsed.device !== 'Desktop' ? parsed.device : (clientDevice || 'Desktop'));

  const finalOs = (body.clientEnv && /ios|iphone/i.test(body.clientEnv))
    ? 'iOS'
    : ((body.clientEnv && /android/i.test(body.clientEnv)) ? 'Android' : parsed.os);
  const finalBrowser = parsed.browser !== 'Unknown Browser' ? parsed.browser : (body.clientEnv ? body.clientEnv.split('·').pop().trim() : 'Unknown Browser');

  const now = Date.now();

  // Prune inactive sessions (> 40s)
  for (const [id, s] of global.__MMA_SESSIONS__.entries()) {
    if (now - s.lastSeen > 40000) {
      global.__MMA_SESSIONS__.delete(id);
    }
  }

  if (eventType === 'leave') {
    global.__MMA_SESSIONS__.delete(sessionId);
    try {
      await sendToUpstash('DEL', 'mma:session:' + sessionId);
    } catch (e) {}
    return res.status(200).json({ success: true, activeCount: global.__MMA_SESSIONS__.size });
  }

  const existing = global.__MMA_SESSIONS__.get(sessionId) || {};
  const firstSeen = existing.firstSeen || now;
  const durationSeconds = Math.floor((now - firstSeen) / 1000);

  const sessionObj = {
    sessionId,
    visitorId,
    ip: rawIp,
    maskedIp: maskIp(rawIp),
    country,
    city,
    region,
    os: finalOs,
    browser: finalBrowser,
    device: finalDevice,
    sceneIdx,
    sceneTitle,
    lang,
    referrer,
    screen,
    firstSeen,
    lastSeen: now,
    durationSeconds
  };

  global.__MMA_SESSIONS__.set(sessionId, sessionObj);
  global.__MMA_TOTAL_PV__++;

  // Log record
  if (eventType === 'visit' || eventType === 'scene_change' || !existing.sessionId) {
    const logItem = {
      ...sessionObj,
      timestamp: new Date().toISOString(),
      eventType
    };
    global.__MMA_HISTORY__.push(logItem);
    if (global.__MMA_HISTORY__.length > 200) {
      global.__MMA_HISTORY__.shift();
    }
  }

  saveTmpStorage();

  // Upstash Redis 전송 (영구 클라우드 동기화)
  try {
    await sendToUpstash('SETEX', 'mma:session:' + sessionId, 40, JSON.stringify(sessionObj));
    await sendToUpstash('INCR', 'mma:pv_total');
    const today = new Date().toISOString().split('T')[0];
    await sendToUpstash('SADD', 'mma:daily_visitors:' + today, visitorId);
    if (eventType === 'visit' || eventType === 'scene_change') {
      await sendToUpstash('LPUSH', 'mma:logs', JSON.stringify(sessionObj));
      await sendToUpstash('LTRIM', 'mma:logs', 0, 199);
    }
  } catch (e) {}

  return res.status(200).json({
    success: true,
    activeCount: global.__MMA_SESSIONS__.size,
    sessionId,
    clientInfo: {
      ip: rawIp,
      maskedIp: maskIp(rawIp),
      city,
      country,
      device: finalDevice,
      browser: finalBrowser,
      os: finalOs
    }
  });
};