/**
 * MMANOVEL 실시간 방문자 관제 트래커 (Hybrid: BroadcastChannel + PeerJS + Serverless)
 */
(function() {
  function getUuid(prefix) {
    return (prefix || 'u') + '_' + Math.random().toString(36).substring(2, 9);
  }

  let visitorId = null;
  try {
    visitorId = localStorage.getItem('mma_visitor_id');
    if (!visitorId) {
      visitorId = getUuid('vis');
      localStorage.setItem('mma_visitor_id', visitorId);
    }
  } catch(e) {
    visitorId = getUuid('vis');
  }

  let sessionId = null;
  try {
    sessionId = sessionStorage.getItem('mma_session_id');
    if (!sessionId) {
      sessionId = getUuid('ses');
      sessionStorage.setItem('mma_session_id', sessionId);
    }
  } catch(e) {
    sessionId = getUuid('ses');
  }

  const SCENE_NAMES = [
    'SCENE 0: 통지서 확인 & 일정 변경',
    'SCENE 1: 힘찬이 첫 만남 & 수검 동의',
    'SCENE 2: 관할 병무청 및 일정 선택',
    'SCENE 3: 병무청 민원 신청서 확인',
    'SCENE 4: 질환/시력 맞춤 서류 점검',
    'SCENE 5: 병무청 로비 및 카드 발급',
    'SCENE 6: 탈의실 환복 & 검사복 착용',
    'SCENE 7: 심리검사장 인지능력 검사',
    'SCENE 8: 임상병리 및 흉부 X-ray',
    'SCENE 9: 기본검사 (BMI/시력/혈압)',
    'SCENE 10: 과목별 전문의 정밀 진료',
    'SCENE 11: 군 특기 및 적성분류',
    'SCENE 12: 수석판정관 최종 판정 & 여비',
    'SCENE 13: 탈의실 환복 및 소지품 회수',
    'SCENE 14: 집 도착 & 제1화 완결'
  ];

  let currentScene = 0;
  const startTime = Date.now();

  function getSceneTitle(idx) {
    if (idx === 'lobby') return '메인 로비 (에피소드 선택 화면)';
    return SCENE_NAMES[idx] || ('SCENE ' + idx);
  }

  function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) return 'Mobile';
    if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }

  function getOsAndBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    let os = 'Windows';
    if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('iphone')) os = 'iOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('linux')) os = 'Linux';

    let browser = 'Chrome';
    if (ua.includes('whale')) browser = 'Naver Whale';
    else if (ua.includes('samsungbrowser')) browser = 'Samsung Internet';
    else if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';

    return os + ' · ' + browser;
  }

  function getPayload(eventType) {
    return {
      sessionId: sessionId,
      visitorId: visitorId,
      eventType: eventType || 'heartbeat',
      sceneIdx: currentScene,
      sceneTitle: getSceneTitle(currentScene),
      lang: (typeof currentLang !== 'undefined' ? currentLang : 'ko'),
      referrer: document.referrer || '직접 접속 (Direct)',
      device: getDeviceType(),
      clientEnv: getOsAndBrowser(),
      firstSeen: startTime,
      lastSeen: Date.now(),
      durationSeconds: Math.floor((Date.now() - startTime) / 1000)
    };
  }

  // 1. BroadcastChannel (같은 브라우저 탭 간 실시간 0ms 동기화)
  let bc = null;
  try {
    bc = new BroadcastChannel('mma_visitor_presence');
  } catch(e) {}

  function broadcastPresence(eventType) {
    const payload = getPayload(eventType);
    if (bc) {
      try { bc.postMessage(payload); } catch(e) {}
    }
    // localStorage 공유
    try {
      const allStr = localStorage.getItem('mma_live_sessions_cache') || '{}';
      const all = JSON.parse(allStr);
      if (eventType === 'leave') {
        delete all[sessionId];
      } else {
        all[sessionId] = payload;
      }
      localStorage.setItem('mma_live_sessions_cache', JSON.stringify(all));
    } catch(e) {}
  }

  // 2. Serverless API (/api/track)
  function sendServerless(eventType) {
    const payload = getPayload(eventType);
    const endpoint = '/api/track';

    if (eventType === 'leave') {
      if (navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon(endpoint, blob);
          return;
        } catch(e) {}
      }
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function() {});
  }

  // 통합 전송
  function trackAll(eventType, sceneIdx) {
    if (sceneIdx !== undefined) currentScene = sceneIdx;
    broadcastPresence(eventType);
    sendServerless(eventType);
  }

  // 초기 시작
  trackAll('visit', 0);

  // 3초 주기 Heartbeat (로컬 및 서버 갱신)
  setInterval(function() {
    trackAll('heartbeat', currentScene);
  }, 3000);

  // 탭 닫기/이탈 시
  window.addEventListener('pagehide', function() {
    trackAll('leave', currentScene);
  });

  window.MmaTracker = {
    reportScene: function(idx) {
      trackAll('scene_change', idx);
    },
    reportLobby: function() {
      trackAll('scene_change', 'lobby');
    }
  };
})();