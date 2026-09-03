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

async function sendToUpstash(cmd, ...args) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
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

  loadTmpStorage();
  const now = Date.now();

  let activeList = [];
  let historyList = [];
  let totalPv = global.__MMA_TOTAL_PV__ || 0;
  let todayVisitorSet = new Set();
  let storageEngine = 'Serverless In-Memory + /tmp';

  // Check Upstash Redis first
  const upstashUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
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
      const todayCount = (todayCardRes && todayCardRes.result) ? parseInt(todayCardRes.result, 10) : 0;

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
  const sceneCounts = {};
  for (let i = 0; i <= 14; i++) sceneCounts[i] = 0;

  // Device Breakdown
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const cityCounts = {};

  activeVisitors.forEach(v => {
    if (v.sceneIdx !== undefined && sceneCounts[v.sceneIdx] !== undefined) {
      sceneCounts[v.sceneIdx]++;
    }
    if (deviceCounts[v.device] !== undefined) {
      deviceCounts[v.device]++;
    } else {
      deviceCounts.Desktop++;
    }
    const c = v.city || '기타';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });

  historyList.forEach(h => {
    if (h.visitorId) todayVisitorSet.add(h.visitorId);
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
      todayVisitors: Math.max(todayVisitorSet.size, totalActive),
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
    timestamp: new Date().toISOString()
  });
};