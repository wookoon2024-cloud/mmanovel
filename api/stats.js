const fs = require('fs');
const path = require('path');

// Ensure fallback cache exists
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

function extractClientIp(req) {
  let ip = '';
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
  if (!ip) ip = '127.0.0.1';

  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  return ip;
}

function formatDuration(sec = 0) {
  if (sec < 60) return sec + '초';
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  return mins + '분 ' + remSec + '초';
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientIp = extractClientIp(req);
  loadTmpStorage();
  const now = Date.now();

  let activeList = [];
  let historyList = [];
  let totalPv = global.__MMA_TOTAL_PV__ || 0;
  let todayVisitorSet = new Set();
  let todayCount = 0;
  let storageEngine = 'Serverless In-Memory + /tmp';

  // Check Upstash Redis first
  const upstashUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || DEFAULT_UPSTASH_URL;
  if (upstashUrl) {
    try {
      storageEngine = 'Upstash Redis (Vercel KV Cloud)';
      const keysRes = await sendToUpstash('KEYS', 'mma:session:*');
      if (keysRes && Array.isArray(keysRes.result) && keysRes.result.length > 0) {
        const mgetRes = await sendToUpstash('MGET', ...keysRes.result);
        if (mgetRes && Array.isArray(mgetRes.result)) {
          activeList = mgetRes.result
            .filter(Boolean)
            .map(item => typeof item === 'string' ? JSON.parse(item) : item);
        }
      }
      const pvRes = await sendToUpstash('GET', 'mma:pv_total');
      if (pvRes && pvRes.result) totalPv = parseInt(pvRes.result, 10);

      const today = new Date().toISOString().split('T')[0];
      const todayCardRes = await sendToUpstash('SCARD', 'mma:daily_visitors:' + today);
      todayCount = (todayCardRes && todayCardRes.result) ? parseInt(todayCardRes.result, 10) : 0;

      const logsRes = await sendToUpstash('LRANGE', 'mma:logs', 0, 99);
      if (logsRes && Array.isArray(logsRes.result)) {
        historyList = logsRes.result.map(item => typeof item === 'string' ? JSON.parse(item) : item);
      }
    } catch (e) {
      console.error('Upstash fetch failed, falling back:', e);
    }
  }

  // Fallback to in-memory/tmp if Upstash not present or empty
  if (activeList.length === 0) {
    for (const [id, s] of global.__MMA_SESSIONS__.entries()) {
      if (now - s.lastSeen <= 40000) {
        activeList.push(s);
        todayVisitorSet.add(s.visitorId);
      } else {
        global.__MMA_SESSIONS__.delete(id);
      }
    }
  }

  if (historyList.length === 0) {
    historyList = [...global.__MMA_HISTORY__].reverse();
  }

  // Aggregate stats
  const activeVisitors = activeList.map(s => {
    const elapsed = Math.floor((now - (s.firstSeen || now)) / 1000);
    const lastAgo = Math.floor((now - (s.lastSeen || now)) / 1000);
    return {
      ...s,
      durationSeconds: elapsed,
      durationFormatted: formatDuration(elapsed),
      lastActiveAgo: lastAgo <= 2 ? '방금 전' : lastAgo + '초 전'
    };
  }).sort((a, b) => b.lastSeen - a.lastSeen);

  // Funnel & Scene Counts
  const sceneCounts = { lobby: 0 };
  for (let i = 0; i <= 14; i++) sceneCounts[i] = 0;

  // Device & City Breakdown (활성 방문자 + 히스토리 고유 방문자 누적 집계)
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const cityCounts = {};
  const countedVisitors = new Set();

  activeVisitors.forEach(v => {
    if (v.sceneIdx === 'lobby' || (typeof v.sceneIdx === 'string' && v.sceneIdx.startsWith('lobby'))) {
      sceneCounts.lobby = (sceneCounts.lobby || 0) + 1;
    } else if (v.sceneIdx !== undefined && sceneCounts[v.sceneIdx] !== undefined) {
      sceneCounts[v.sceneIdx]++;
    }
    const dev = (v.device === 'Mobile' || v.device === 'Tablet')
      ? v.device
      : ((v.os && /android|ios|iphone/i.test(v.os)) ? 'Mobile' : 'Desktop');
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    const c = v.city || '기타';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
    if (v.visitorId || v.sessionId) countedVisitors.add(v.visitorId || v.sessionId);
  });

  historyList.forEach(h => {
    if (h.visitorId) todayVisitorSet.add(h.visitorId);
    const id = h.visitorId || h.sessionId;
    if (id && !countedVisitors.has(id)) {
      countedVisitors.add(id);
      const dev = (h.device === 'Mobile' || h.device === 'Tablet')
        ? h.device
        : ((h.os && /android|ios|iphone/i.test(h.os)) ? 'Mobile' : 'Desktop');
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
      const c = h.city || '기타';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    }
  });

  const totalActive = activeVisitors.length;
  const completedCount = historyList.filter(h => h.sceneIdx >= 12).length;
  const completionRate = historyList.length > 0
    ? ((completedCount / historyList.length) * 100).toFixed(1) + '%'
    : '0.0%';

  const avgDur = activeVisitors.length > 0
    ? Math.round(activeVisitors.reduce((acc, cur) => acc + (cur.durationSeconds || 0), 0) / activeVisitors.length)
    : 0;

  return res.status(200).json({
    kpi: {
      activeCount: totalActive,
      todayVisitors: Math.max(todayCount, todayVisitorSet.size, totalActive),
      totalPageviews: Math.max(totalPv, historyList.length, totalActive),
      avgDurationSeconds: avgDur,
      avgDurationFormatted: formatDuration(avgDur),
      completionRate
    },
    activeVisitors,
    recentLogs: historyList.slice(0, 100),
    deviceBreakdown: deviceCounts,
    cityBreakdown: cityCounts,
    sceneFunnel: sceneCounts,
    storageEngine,
    clientIp,
    timestamp: new Date().toISOString()
  });
};