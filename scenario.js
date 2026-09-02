/**
 * =========================================================================
 * 📜 [병무청 비주얼 노벨 - 전체 시나리오 대본 데이터 (scenario.js)]
 * =========================================================================
 * 
 * 💡 대본 및 연출 수정 가이드:
 * - bg: 배경 이미지 ('assets/room.jpg', 'assets/lobby.jpg', 'assets/exam_room.jpg')
 * - char: 캐릭터 이미지 ('assets/minwoo.png', 'assets/himchan.png', 'assets/doctor.png')
 * - charPos: 캐릭터 위치 ('right', 'left', 'center') -> 기본값 'right' (우측)
 * - speaker: 화자 이름 (깔끔한 텍스트 표출)
 * - plateClass: 이름표 색상 그라데이션
 * - text: 출력할 대사 (줄바꿈 \n 으로 자연스러운 호흡 분절)
 * - apiSource: 하단 데이터 출처 배지 텍스트
 * - apiIcon: 'database'(DB), 'scale'(법령), 'book-open'(스토리)
 * - isApi: true일 경우 '✓ 실시간 연동' 녹색 배지 표출
 * - widgetType: 화면에 띄울 인터랙티브 UI 위젯 (없으면 null)
 */

const SCENARIOS = [
  // [SCENE 0] 민우의 자취방 - 통지서 수령
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo.png",
    charPos: "right",
    speaker: "김민우 (주인공)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "드디어 올 게 왔네...\n다음 주 수요일에 검사받으러 오라는데,\n그날 대학교 중간고사 첫날이잖아? 꼭 이 날짜에 가야 하는 건가...",
    apiSource: "스토리: 병역판정검사 통지서 수령 (민우의 자취방)",
    apiIcon: "book-open",
    isApi: false,
    widgetType: null
  },

  // [SCENE 1] 민우의 자취방 - 힘찬이 등장 & 일정 변경 제안
  {
    bg: "assets/room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "충성! 안녕하십니까 민우 님, 병무청 AI 가이드 '힘찬이'입니다!\n\n많은 청년들이 잘 모르시는데, 병역판정검사는 공석만 있다면\n통지된 날짜와 상관없이 희망일 전날까지 원하는 날짜로 100% 자유롭게 변경할 수 있습니다.\n\n민우 님 지역 관할 병무청의 [월별 실시간 잔여석 달력]을 확인해 보시겠습니까?",
    apiSource: "공공데이터포털: 병무청_병역판정 신체검사 정보 Open API",
    apiIcon: "database",
    isApi: true,
    widgetType: "CHOICE_SCHEDULE_CONSENT"
  },

  // [SCENE 2] 민우의 자취방 - 지역 및 달력 선택
  {
    bg: "assets/room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "거주하고 계신 지역을 선택하시면,\n해당 지방병무청의 실시간 잔여석 달력을 바로 띄워드릴게요!",
    apiSource: "공공데이터포털: 병무청_지방병무청별_일자별_수검공석현황 API",
    apiIcon: "database",
    isApi: true,
    widgetType: "REGION_CALENDAR_PICKER"
  },

  // [SCENE 3] 민우의 자취방 - 예약 확정 및 직통 연락처
  {
    bg: "assets/room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "탁월한 선택입니다! 시험이 끝난 [10월 29일 목요일 오전]으로 일정을 찜하셨네요.\n\n해당 일정으로 변경하거나 궁금한 점이 있을 때\n바로 문의할 수 있는 직통 연락처를 안내해 드립니다.",
    apiSource: "공공데이터포털: 병무청_지방병무(지)청 조직 및 부서별 연락처 Open API",
    apiIcon: "database",
    isApi: true,
    widgetType: "CONTACT_CARD"
  },

  // [SCENE 4] 민우의 자취방 - 맞춤형 서류 점검
  {
    bg: "assets/room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "일정이 정해졌으니, 검사 당일 헛걸음하지 않도록\n민우 님의 몸 상태에 맞는 맞춤형 구비서류를 미리 챙겨볼까요?\n\n평소 앓고 계신 질환이나 수술 이력이 있으신가요?",
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) [별표 2]",
    apiIcon: "scale",
    isApi: true,
    widgetType: "HEALTH_CHECK_CHOICE"
  },

  // [SCENE 5] 병무청 1층 로비 - 검사장 도착 & 나라사랑카드 선택
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "드디어 검사 당일!\n강원지방병무청 1층 로비 안내데스크에서 신분증을 태그하고 전용 검사복으로 환복해 주세요.\n\n그리고 오늘 검사 여비(교통비/식비)와 군 월급을 입금받을 나라사랑카드를 등록할 차례입니다.\n혜택을 비교해 보시고 마음에 드는 카드를 선택해 보세요!",
    apiSource: "공공데이터포털: 병무청_나라사랑카드 금융연계 서비스 API",
    apiIcon: "database",
    isApi: true,
    widgetType: "NARA_CARD_CHOICE"
  },

  // [SCENE 6] 검사실 전산실 - 1차 심리검사
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "심리상담관 NPC",
    plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
    text: "병역판정검사의 첫 순서는 '심리검사'입니다.\n\n전산실 모니터 화면에 나오는\n1차 인성 및 인지능력 검사 문항을 솔직하게 답변해 주세요.",
    apiSource: "국가법령정보센터: 「병역법」 제11조 및 병역판정 심리검사 운영 규정",
    apiIcon: "scale",
    isApi: true,
    widgetType: "PSYCH_TEST_UI"
  },

  // [SCENE 7] 검사실 - 임상병리 및 영상의학
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "임상병리사 NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    text: "간기능, 혈당, 단백뇨 등을 확인하기 위해 소변 검사와 채혈을 진행하고, 흉부 X-ray 촬영을 마쳤습니다.\n\n이제 자동 신체계측실로 이동하여\n키와 몸무게(BMI), 혈압을 측정하겠습니다.",
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」 [별표 1] 신장·체중 판정기준",
    apiIcon: "scale",
    isApi: true,
    widgetType: null
  },

  // [SCENE 8] 검사실 - 신체계측 & BMI 계산기
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "의무관 NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    text: "측정 발판에 올라서 주세요.\n\n본인의 키와 몸무게를 입력해\n실시간 BMI 체질량지수 판정을 확인해 보세요!",
    apiSource: "국가법령정보센터: 「검사규칙」 [별표 1] 및 신장·체중 불시 재측정 규정",
    apiIcon: "scale",
    isApi: true,
    widgetType: "BMI_CALCULATOR"
  },

  // [SCENE 9] 검사실 - 전문의 정밀 진료
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "정형외과 전담의사 NPC",
    plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
    text: "제출하신 병무용 진단서와 관절 수술기록지, 최근 MRI 영상 CD를 면밀히 검토했습니다.\n\n관절 동요도 정밀 측정 결과, 국방부령 [별표 2] 기준에 부합하여\n정형외과 4급(보충역) 소견으로 수석판정관실에 상신합니다.",
    apiSource: "국가법령정보센터: 「검사규칙」(국방부령) 제11조 및 [별표 2] 204호",
    apiIcon: "scale",
    isApi: true,
    widgetType: null
  },

  // [SCENE 10] 1층 로비 - 최종 판정, 여비 정산 & 정책 홍보
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "김민우 님, 최종 [신체등급 4급, 보충역(사회복무요원)]으로 판정되었습니다!\n\n오늘 검사 여비는 춘천 거주지 기준 [총 16,500원]이 나라사랑카드 계좌로 즉시 입금 처리되었습니다.\n\n귀가하시기 전에 e-병무지갑과 병역진로설계센터 혜택을 꼭 확인하세요!",
    apiSource: "공공데이터포털: 병무청_병역의무자 여비 지급 기준 데이터 (실시간 산정)",
    apiIcon: "database",
    isApi: true,
    widgetType: "FINAL_SUMMARY_CARDS"
  }
];
