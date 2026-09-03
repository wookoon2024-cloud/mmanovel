/**
 * MMANOVEL 실시간 방문자 관제 트래커 (Real-time Analytics Tracker)
 * - Vercel Serverless /api/track 자동 연동
 * - 접속자 세션 및 방문자 식별자(UUID) 생성/유지
 * - 10초 주기 Heartbeat 자동 전송
 * - 씬 전환 시 실시간 진행도 보고
 * - 탭 닫기/이탈 시 sendBeacon 비동기 정리
 */
(function() {
  function getUuid(prefix = 'u') {
    return prefix + '_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
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
    'SCENE 0: 통지서 확인 및 스마트 일정 변경',
    'SCENE 1: 힘찬이와 첫 만남 & 수검 동의',
    'SCENE 2: 관할 지방병무청 및 희망일자 선택',
    'SCENE 3: 병무청 민원 신청서 확인 및 접수',
    'SCENE 4: 질환/시력 맞춤형 구비서류 점검',
    'SCENE 5: 병무청 로비 도착 및 나라사랑카드 발급',
    'SCENE 6: 탈의실 환복 및 검사복 착용',
    'SCENE 7: 심리검사장 인지능력 및 인성검사',
    'SCENE 8: 임상병리 소변·혈액검사 및 흉부 X-ray',
    'SCENE 9: 기본검사실 신장·체중(BMI)·시력·혈압',
    'SCENE 10: 과목별 전문의 1:1 정밀 진료',
    'SCENE 11: 군 특기 및 병과 적성분류',
    'SCENE 12: 수석판정관실 최종 판정 및 여비 정산',
    'SCENE 13: 탈의실 환복 및 소지품 회수',
    'SCENE 14: 집 도착 & 제1화 완결'
  ];

  let currentScene = 0;

  function getSceneTitle(idx) {
    if (idx === 'lobby') return '메인 로비 (에피소드 선택 화면)';
    return SCENE_NAMES[idx] || ('SCENE ' + idx);
  }

  function sendTracking(eventType, sceneIdx) {
    if (sceneIdx !== undefined) currentScene = sceneIdx;
    const payload = {
      sessionId,
      visitorId,
      eventType: eventType || 'heartbeat',
      sceneIdx: currentScene,
      sceneTitle: getSceneTitle(currentScene),
      lang: (typeof currentLang !== 'undefined' ? currentLang : 'ko'),
      referrer: document.referrer || '',
      screen: window.screen ? (window.screen.width + 'x' + window.screen.height) : ''
    };

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

  // 초기 방문 전송
  sendTracking('visit', 0);

  // 10초 주기 Heartbeat
  setInterval(function() {
    sendTracking('heartbeat', currentScene);
  }, 10000);

  // 탭 닫기/이탈 시
  window.addEventListener('pagehide', function() {
    sendTracking('leave', currentScene);
  });
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      sendTracking('heartbeat', currentScene);
    }
  });

  // 전역 추적 헬퍼
  window.MmaTracker = {
    reportScene: function(idx) {
      sendTracking('scene_change', idx);
    },
    reportLobby: function() {
      sendTracking('scene_change', 'lobby');
    }
  };
})();