/**
 * =========================================================================
 * 📡 [병무청 비주얼 노벨 제2화 - 공공데이터 & 법령 전용 API 서비스 (api_ep2.js)]
 * =========================================================================
 * 
 * 국방부/병무청 Open API 및 국가법령정보센터 데이터를 연동하며,
 * 전국 과학화 예비군훈련장 공석, 셔틀버스 노선, PX 면세 품목, 훈련보상비 산출을 지원합니다.
 */

const MMA_EP2_API_CONFIG = {
  // 전국 주요 과학화 예비군훈련장 메타데이터
  TRAINING_CENTERS: {
    "금곡 과학화예비군훈련장": {
      region: "서울/경기동부",
      address: "경기도 남양주시 홍유릉로 156",
      transport: "경춘선 금곡역 1번 출구 (도보 10분)",
      shuttleStation: "망우역 1번 출구 / 구리역 3번 출구 앞",
      shuttleTime: "08:10 / 08:25 / 08:40 (15분 간격 운행)",
      baseAllowance: 16000, // 교통비 8,000원 + 급식비 8,000원
      vacancies: [
        { date: "2026-10-23 (금)", type: "평일 훈련", morning: 32, afternoon: 0, status: "available" },
        { date: "2026-10-24 (토)", type: "휴일 훈련", morning: 24, afternoon: 0, status: "available" },
        { date: "2026-10-25 (일)", type: "휴일 훈련", morning: 8, afternoon: 0, status: "almost_full" },
        { date: "2026-10-30 (금)", type: "평일 훈련", morning: 45, afternoon: 0, status: "available" }
      ]
    },
    "박달 과학화예비군훈련장": {
      region: "서울/경기남부",
      address: "경기도 안양시 만안구 박달로 115",
      transport: "1호선 안양역 1번 출구 버스 환승",
      shuttleStation: "안양역 1번 출구 광장 앞 시내 셔틀",
      shuttleTime: "08:15 / 08:30 / 08:45",
      baseAllowance: 16000,
      vacancies: [
        { date: "2026-10-23 (금)", type: "평일 훈련", morning: 18, afternoon: 0, status: "available" },
        { date: "2026-10-24 (토)", type: "휴일 훈련", morning: 5, afternoon: 0, status: "almost_full" },
        { date: "2026-10-31 (토)", type: "휴일 훈련", morning: 28, afternoon: 0, status: "available" }
      ]
    },
    "노고산 과학화예비군훈련장": {
      region: "서울/경기북부",
      address: "경기도 양주시 장흥면 북한산로 778",
      transport: "3호선 구파발역 2번 출구",
      shuttleStation: "구파발역 2번 출구 앞 전용 셔틀 버스",
      shuttleTime: "08:10 / 08:25 / 08:40",
      baseAllowance: 16000,
      vacancies: [
        { date: "2026-10-24 (토)", type: "휴일 훈련", morning: 15, afternoon: 0, status: "available" },
        { date: "2026-10-25 (일)", type: "휴일 훈련", morning: 0, afternoon: 0, status: "full" }
      ]
    }
  },

  // 국군복지단 군마트(PX) 인기 품목 및 면세 할인율 데이터
  PX_ITEMS: [
    {
      id: "px_snail",
      name: "닥터지 블랙스네일 달팽이 크림 (50ml)",
      category: "스킨케어",
      retailPrice: 32000,
      pxPrice: 7800,
      discountRate: "76%",
      desc: "예비군 효도 선물 1위! 달팽이 점액 여과물이 함유된 프리미엄 탄력 크림"
    },
    {
      id: "px_ginseng",
      name: "정관장 홍삼정 옥고 (250g)",
      category: "건강기능식품",
      retailPrice: 65000,
      pxPrice: 19500,
      discountRate: "70%",
      desc: "면역력 증진에 탁월한 6년근 농축액, 부모님 선물 추천"
    },
    {
      id: "px_maskpack",
      name: "듀이트리 울트라 아쿠아 마스크팩 (10매)",
      category: "팩/마스크",
      retailPrice: 20000,
      pxPrice: 4200,
      discountRate: "79%",
      desc: "피부 진정 및 강력 수분 공급 고밀착 딥마스크"
    },
    {
      id: "px_pocari",
      name: "포카리스웨트 분말 대용량 파우더 (5팩)",
      category: "음료/스낵",
      retailPrice: 9000,
      pxPrice: 2700,
      discountRate: "70%",
      desc: "운동할 때 물에 타 먹는 군대 추억의 필수템"
    }
  ],

  // 핵심 근거 법령 및 청년 권익보장 규정
  LEGAL_CODES: {
    STUDY_WORK_PROTECTION: {
      lawName: "예비군법 제10조의2 (학업 및 직장의 보장)",
      clause1: "고등학교 이상의 학교의 장은 학생이 예비군 훈련에 참가한 기간을 결석으로 처리하거나 불리하게 처우하지 못한다.",
      clause2: "고용주는 근로자가 예비군 훈련을 받는 기간을 유급으로 처리하여야 하며, 휴무나 결근으로 처리하지 못한다.",
      punishment: "위반 시 2년 이하의 징역 또는 2,000만원 이하의 벌금 (예비군법 제15조 제8항)"
    },
    UNIFORM_RENTAL: {
      orderName: "국방부 예비군 훈련 관리 훈령 (피복 및 장구류 관리)",
      rule: "체형 변화 또는 피복 분실로 전투복 착용이 곤란한 훈련 소집 대상자에 대하여 훈련부대는 전투복, 전투화, 요대, 방한모를 무상 대여한다."
    }
  }
};

// 전역 객체 등록
if (typeof window !== "undefined") {
  window.MMA_EP2_API_CONFIG = MMA_EP2_API_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MMA_EP2_API_CONFIG };
}
