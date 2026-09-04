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

  let currentScene = 'lobby';
  const startTime = Date.now();

  let clientRealIp = '';
  let clientMaskedIp = '';
  let clientCity = '';

  try {
    clientRealIp = localStorage.getItem('mma_client_ip') || '';
    clientMaskedIp = localStorage.getItem('mma_client_masked_ip') || '';
    clientCity = localStorage.getItem('mma_client_city') || '';
  } catch(e) {}

  // 실제 접속 PC 공인 IP 조회 (클라이언트 사이드 신속 감지)
  if (!clientRealIp || clientRealIp === '127.0.0.1') {
    fetch('https://api64.ipify.org?format=json')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.ip) {
          clientRealIp = d.ip;
          clientMaskedIp = d.ip.includes('.') ? d.ip.split('.').slice(0, 2).join('.') + '.*.*' : d.ip;
          try {
            localStorage.setItem('mma_client_ip', clientRealIp);
            localStorage.setItem('mma_client_masked_ip', clientMaskedIp);
          } catch(e) {}
          broadcastPresence('ip_update');
        }
      })
      .catch(function() {});
  }

  function getSceneTitle(idx) {
    if (idx === 'lobby' || idx === 'main' || idx === -1) return '메인 로비 (시나리오 선택 중)';
    if (typeof idx === 'string' && idx.startsWith('lobby_ep')) {
      const ep = idx.replace('lobby_ep', '');
      return `메인 로비 (제${ep}화 시나리오 선택 중)`;
    }
    return SCENE_NAMES[idx] || ('SCENE ' + idx);
  }

  function getDeviceType() {
    const ua = (navigator.userAgent || '').toLowerCase();
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const screenWidth = Math.min(window.screen.width || 9999, window.innerWidth || 9999);
    const isSmall = screenWidth <= 768;

    // 1. 명시적 모바일/스마트폰 UA
    if (/iphone|ipod|mobile|android.*mobile|mobile.*android|blackberry|iemobile|opera mini/i.test(ua)) {
      return 'Mobile';
    }
    // 2. 태블릿 UA
    if (/ipad|tablet/i.test(ua) || (ua.includes('android') && !isSmall && !ua.includes('mobile'))) {
      return 'Tablet';
    }
    // 3. 터치스크린 + 작은 화면 폭 (데스크톱 모드 스마트폰 포함 완벽 감지)
    if (hasTouch && isSmall) {
      return 'Mobile';
    }
    // 4. 안드로이드 기기는 기본 모바일 우선
    if (ua.includes('android')) {
      return isSmall ? 'Mobile' : 'Tablet';
    }
    // 5. 터치 기반 비-윈도우 기기 (iPad 데스크톱 모드 등)
    if (hasTouch && !ua.includes('windows')) {
      return isSmall ? 'Mobile' : 'Tablet';
    }
    return 'Desktop';
  }

  function getOsAndBrowser() {
    const ua = navigator.userAgent || '';
    const uaLower = ua.toLowerCase();
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const screenWidth = Math.min(window.screen.width || 9999, window.innerWidth || 9999);
    const isSmall = screenWidth <= 768;

    let os = 'Windows';
    if (uaLower.includes('mac')) {
      os = (hasTouch && navigator.maxTouchPoints > 1) ? (isSmall ? 'iOS' : 'iPadOS') : 'macOS';
    } else if (uaLower.includes('iphone') || uaLower.includes('ipod')) {
      os = 'iOS';
    } else if (uaLower.includes('ipad')) {
      os = 'iPadOS';
    } else if (uaLower.includes('android')) {
      os = 'Android';
    } else if (uaLower.includes('linux')) {
      os = (hasTouch && isSmall) ? 'Android' : 'Linux';
    }

    let browser = 'Chrome';
    if (uaLower.includes('whale')) browser = 'Whale';
    else if (uaLower.includes('samsungbrowser')) browser = 'Samsung Internet';
    else if (uaLower.includes('kakaotalk')) browser = 'KakaoTalk';
    else if (uaLower.includes('naver')) browser = 'Naver App';
    else if (uaLower.includes('edg/')) browser = 'Edge';
    else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'Safari';
    else if (uaLower.includes('firefox')) browser = 'Firefox';

    return os + ' · ' + browser;
  }

  function getPayload(eventType) {
    return {
      sessionId: sessionId,
      visitorId: visitorId,
      ip: clientRealIp || '',
      maskedIp: clientMaskedIp || '',
      city: clientCity || '',
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
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.clientInfo) {
        let changed = false;
        if (data.clientInfo.ip && data.clientInfo.ip !== '127.0.0.1') {
          if (clientRealIp !== data.clientInfo.ip) {
            clientRealIp = data.clientInfo.ip;
            clientMaskedIp = data.clientInfo.maskedIp || clientRealIp;
            try {
              localStorage.setItem('mma_client_ip', clientRealIp);
              localStorage.setItem('mma_client_masked_ip', clientMaskedIp);
            } catch(e) {}
            changed = true;
          }
        }
        if (data.clientInfo.city && clientCity !== data.clientInfo.city) {
          clientCity = data.clientInfo.city;
          try { localStorage.setItem('mma_client_city', clientCity); } catch(e) {}
          changed = true;
        }
        if (changed) {
          broadcastPresence('ip_update');
        }
      }
    })
    .catch(function() {});
  }

  // 3. 글로벌 크로스 디바이스 MQTT 연동 (모바일 ↔ PC 실시간 0.1초 동기화)
  let mqttClient = null;
  const MQTT_TOPIC = 'mmanovel_wookoon_2024/presence';

  function initMqtt() {
    if (typeof mqtt !== 'undefined' && mqtt.connect) {
      try {
        mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
          clientId: 'novel_' + Math.random().toString(36).substring(2, 9),
          clean: true,
          reconnectPeriod: 4000,
          connectTimeout: 5000
        });
        mqttClient.on('connect', function() {
          sendMqtt('visit');
        });
      } catch(e) {}
    } else if (!document.getElementById('mqtt-script-tag')) {
      const s = document.createElement('script');
      s.id = 'mqtt-script-tag';
      s.src = 'https://unpkg.com/mqtt@5.3.5/dist/mqtt.min.js';
      s.onload = function() { initMqtt(); };
      document.head.appendChild(s);
    }
  }

  function sendMqtt(eventType) {
    if (mqttClient && mqttClient.connected) {
      try {
        const payload = getPayload(eventType);
        mqttClient.publish(MQTT_TOPIC, JSON.stringify(payload));
      } catch(e) {}
    }
  }

  initMqtt();

  // 통합 전송
  function trackAll(eventType, sceneIdx) {
    if (sceneIdx !== undefined) currentScene = sceneIdx;
    broadcastPresence(eventType);
    sendMqtt(eventType);
    sendServerless(eventType);
  }

  // 초기 시작 (로비 진입)
  trackAll('visit', 'lobby');

  // 3초 주기 Heartbeat (로컬 및 서버 갱신)
  setInterval(function() {
    trackAll('heartbeat', currentScene);
  }, 3000);

  // 탭 닫기/이탈 시
  window.addEventListener('pagehide', function() {
    trackAll('leave', currentScene);
    if (mqttClient && mqttClient.connected) {
      try {
        mqttClient.publish(MQTT_TOPIC, JSON.stringify(getPayload('leave')));
        mqttClient.end(true);
      } catch(e) {}
    }
  });

  window.MmaTracker = {
    reportScene: function(idx) {
      trackAll('scene_change', idx);
    },
    reportLobby: function(epNum) {
      const key = (epNum !== undefined && epNum !== null) ? ('lobby_ep' + epNum) : 'lobby';
      trackAll('scene_change', key);
    }
  };
})();