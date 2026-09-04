/**
 * =========================================================================
 * 📜 [병무청 비주얼 노벨 제2화 - 전체 시나리오 대본 데이터 (scenario_ep2.js)]
 * =========================================================================
 * 
 * 🎮 제2화: 「힘찬이와 함께하는 슬기로운 예비군 라이프」
 * 
 * 💡 시나리오 흐름:
 * 0. [자취방] 알림톡 수신: 첫 예비군 통지서 도착 & 패닉
 * 1. [자취방] 힘찬이 등장 & 예비군 신분/유형 판별 (대학생 방침보류 8시간 안내)
 * 2. [자취방] 중간고사 겹침 해결: 전국단위 자율 훈련 & 휴일 신청 캘린더
 * 3. [D-1 전날] 군복 피팅의 대참사 (살찜/분실) & 무료 피복 대여 사전 신청
 * 4. [훈련 당일] 위병소 지각 방지 골든타임 & 지자체 무료 셔틀버스 탑승
 * 5. [과학화 훈련장] 분대 자율 측정식 실탄 영점사격 (Pass 시 조기퇴소)
 * 6. [실습장] 골든타임 4분 심폐소생술(CPR/AED) & 마일즈 교전 승리
 * 7. [점심시간] 예비군의 꽃! 국군복지단 군마트(PX) 알뜰 쇼핑
 * 8. [훈련장 정문] 16:00 조기퇴소 환호 & 실시간 훈련보상비 계좌 입금
 * 9. [귀가길] 청년 권익보장 '예비군법 제10조의2' 사이다 해설 & 전자 교육필증 엔딩
 */

const SCENARIOS_EP2 = [
  // [SCENE 0] 민우의 자취방 - 스마트폰 알림톡과 첫 소집통지서
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "으음... 아침부터 웬 알림톡이지? 택배인가?\n\n[병무청] {name} 님, 2026년도 예비군 훈련 소집통지서가 도착했습니다.\n...뭐?! 예비군 통지서?! 나 전역한 지 1년밖에 안 됐는데 벌써 예비군이라고?!",
    text_en: "Ugh... What's this Kakao alert in the morning? A delivery package?\n\n[MMA] {name}, your 2026 Reservist Training Notice has arrived.\n...Wait, WHAT?! Reservist notice already?! I was discharged just a year ago!",
    apiSource: "[통지] 병무청 스마트 알림톡 & e-병무지갑 전자고지 시스템 연계",
    apiSource_en: "[Notice] MMA Smart Notification & e-Wallet Electronic Notice System",
    apiSourceUrl: "https://mw.mma.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 1] 민우의 절망 - 시험기간과 훈련 일정의 충돌
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "잠깐만... 수검 일자가 다음 주 10월 15일 목요일이잖아?!\n그날 우리 학과 전공 중간고사 시험 당일인데 어떡하지?!\n설마 전역하고도 또 2박 3일 동안 군부대로 끌려가서 자야 하는 건가...?",
    text_en: "Wait... It says next Thursday, October 15th?!\nThat's the exact day of my major midterm exam!\nAm I really being dragged back into military barracks for 2 nights and 3 days...?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 2] 힘찬이 등장 - 예비군 수호천사로 변신 & 신분 판별
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "단결! 안녕하십니까 {name} 병장님, 병무청 AI 가이드 '힘찬이'입니다!\n국방의 의무를 훌륭히 마치신 {name} 님, 첫 소집통지에 많이 놀라셨죠?\n\n하지만 걱정 마세요! 예비군 훈련은 본인의 [신분과 직업]에 따라 훈련 형태가 완전히 달라집니다.",
    text_en: "Salute! Hello Sergeant {name}! I'm Himchan, your MMA AI Guide!\nDischarged veteran {name}, startled by your first call-up notice?\n\nDon't worry at all! Reservist training categories differ completely depending on your [Current Status & Occupation].",
    apiSource: "[근거 법령] 「병역법」 제44조~제54조(동원훈련) 및 「예비군법」 제6조(훈련)",
    apiSource_en: "[Law] Military Service Act Arts 44-54 & Reserve Forces Act Art 6",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: "EP2_STATUS_CHECK"
  },

  // [SCENE 3] 대학생 방침보류(8시간) 판정 안내
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "맞습니다! 대학교 재학생인 {name} 님은 [방침일부보류(학생예비군)] 대상자입니다!\n\n일반 동원훈련(2박 3일/28시간)이나 동미참(4일/32시간) 대신,\n1년에 단 하루! [8시간 기본훈련]만 이수하시면 올해 훈련이 100% 완료 처리됩니다!",
    text_en: "Exactly! As an enrolled college student, you qualify for [Policy Partial Suspension (Student Reservist)]!\n\nInstead of 2-night 3-day mobilization or 4-day non-mobilization,\nyou only need to take [8-hour Basic Training for 1 day] per year to complete 100% of your requirement!",
    apiSource: "[근거 법령] 국가법령정보센터: 「예비군법 시행령」 제4조 및 병무청 동원보류처리지침",
    apiSource_en: "[Law] Reserve Forces Act Enforcement Decree Art 4 & MMA Deferment Guidelines",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: null
  },

  // [SCENE 4] 전국단위 훈련 신청 & 휴일 훈련 자율 선택
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "중간고사 시험 날짜와 겹치더라도 전혀 걱정하실 필요 없습니다.\n\n병무청과 국방부는 예비군의 자율성을 위해 [전국단위 훈련 신청] 및 [휴일 훈련 신청] 제도를 제공합니다.\n전국 어느 과학화 훈련장이든 원하는 날짜의 공석을 직접 선택해 보실까요?",
    text_en: "Even if it overlaps with midterms, there is no need to panic.\n\nMMA and MND provide [Nationwide Training Application] & [Holiday Training Application] systems.\nWould you like to pick your desired date and location across state-of-the-art scientific training centers nationwide?",
    apiSource: "[API] 공공데이터포털: 국방부_예비군훈련 일정 및 전국단위 훈련 공석 현황 Open API",
    apiSource_en: "[API] Public Data Portal: MND Reservist Training Schedules & Nationwide Vacancies API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP2_NATIONWIDE_CALENDAR"
  },

  // [SCENE 5] 예약 확정 및 D-1 전날 밤 군복 피팅 참사
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "으아아악! 지퍼가 안 올라가! 단추가 터질 것 같아...!\n전역하고 야식을 너무 많이 먹었나 봐. 바지 허리가 5cm나 모자라잖아?!\n\n게다가 전투모는 어디 처박혔는지 보이지도 않고, 고무링도 없어! 복장 불량이면 쫓겨나는 거 아냐?!",
    text_en: "Arghhh! The zipper won't zip! The button is about to burst...!\nI guess I ate way too much late-night snacks after discharge. The waist is 5cm too tight?!\n\nAnd where on earth is my cap? No blousing straps either! Am I getting expelled for uniform violation?!",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 6] 피복 무료 대여 제도 및 D-1 체크리스트
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "하하, 전국의 모든 예비역들이 겪는 통과의례죠!\n국방부 예비군 훈련 관리 훈령에 따라 체형 변화나 분실 시 [훈련장에서 전투복·전투화·요대를 100% 무료 대여]해 드립니다!\n\nD-1 필수 준비물을 체크하고 피복 대여를 미리 예약해 볼까요?",
    text_en: "Haha, a rite of passage for all Korean veterans!\nAccording to MND Reservist Regulations, if your size changed or gear is lost, [Uniform, Boots, & Belt are 100% Free to Rent at the Camp]!\n\nLet's check D-1 essential checklist and pre-book your gear rental!",
    apiSource: "[근거 훈령] 국가법령정보센터: 「국방부 예비군 훈련 관리 훈령」(피복 및 장구류 무료 대여 규정)",
    apiSource_en: "[Regulation] MND Reservist Training Administrative Order (Free Uniform & Equipment Rental)",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: "EP2_D1_CHECKLIST"
  },

  // [SCENE 7] 훈련 당일 아침 - 위병소 지각 위기 & 무료 셔틀버스
  {
    bg: "assets/lobby.jpg",
    char: "assets/minwoo_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "현재 시각 8시 20분... 지하철역엔 도착했는데 산속 훈련장까지 대중교통이 애매하잖아?!\n9시 정각에서 1분만 늦어도 위병소 철문 닫히고 '무단 불참' 처리된다는데...\n지각하면 고발당하는 거 아니야?!",
    text_en: "Current time 8:20 AM... I reached the subway station, but public transit to the mountain base is tricky?!\nThey said if you're even 1 minute late past 9:00 AM, gates shut and you're marked absent...\nIf I'm late, do I face legal charges?!",
    apiSource: "[벌칙 법령] 「예비군법」 제15조: 정당한 사유 없이 훈련 불참 시 1년 이하 징역 또는 1천만원 이하 벌금",
    apiSource_en: "[Penalty] Reserve Forces Act Art 15: Absence without legitimate grounds subject to criminal penalty",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: null
  },

  // [SCENE 8] 힘찬이의 지자체 셔틀버스 안내
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "출구 바로 앞을 보세요! 병무청과 지자체가 연계하여 운행하는 [예비군 무료 직통 셔틀버스]가 대기 중입니다!\n\n08시 30분 셔틀버스를 타시면 훈련장 위병소까지 15분 만에 세이프 입소 가능합니다. 탑승해 볼까요?",
    text_en: "Look right in front of the exit! The [Free Reservist Direct Shuttle Bus] operated by MMA & City Council is waiting!\n\nTaking the 8:30 AM shuttle will safely deliver you to the training camp gates in just 15 minutes!",
    apiSource: "[API] 공공데이터포털: 지자체별 과학화 예비군훈련장 무료 수송 셔틀버스 실시간 운행정보 API",
    apiSource_en: "[API] Public Data Portal: Local Government Scientific Camp Free Shuttle Real-time Transit API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP2_SHUTTLE_ROUTE"
  },

  // [SCENE 9] 과학화 예비군훈련장 도착 & 교관의 조기퇴소 선언
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "훈련 교관 (대위)",
    speaker_en: "Training Instructor (Captain)",
    plateClass: "from-emerald-800 to-teal-900 border-emerald-500/40",
    text: "예비군 여러분 환영합니다! 본 과학화 훈련장은 10인 1조 분대별 [자율참여형 측정식 평가]로 진행됩니다.\n\n사격, 영상 모의교전, 응급처치 등 전 종목을 우수하게 통과한 분대는\n국방부 예비군 훈령에 따라 [16:00 조기퇴소] 혜택이 주어집니다!",
    text_en: "Welcome, Reservists! This scientific center conducts [Self-Participatory Measurable Assessments] by 10-person squads.\n\nSquads that pass all subjects including shooting, simulation, and first aid\nwill be granted [16:00 Early Dismissal] per MND Regulations!",
    apiSource: "[근거 규정] 국방부 과학화 예비군훈련장 측정식 합격 및 우수 분대 조기퇴소 지침",
    apiSource_en: "[Rule] MND Scientific Training Evaluation & Early Dismissal Directives",
    apiSourceUrl: "https://www.mnd.go.kr",
    apiIcon: "book-open",
    isApi: true,
    widgetType: null
  },

  // [SCENE 10] 제1과목: 실탄 영점사격 미니게임
  {
    bg: "assets/exam_room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "첫 번째 관문은 [실탄 영점사격 (3발)]입니다!\n탄착군이 좁게 모여야 합격 도장을 받아 조기퇴소에 한 걸음 다가섭니다.\n\n{name} 병장님의 녹슬지 않은 현역 시절 사격 실력을 보여주세요!",
    text_en: "First test is [Zero-ing Live Fire Shooting (3 rounds)]!\nA tight shot group is required to earn the passing stamp towards early dismissal.\n\nShow us your sharp marksmanship from your active-duty days, Sergeant {name}!",
    apiSource: "[평가 기준] 육군 표준 예비군 실탄사격 측정 및 안전관리 지침",
    apiSource_en: "[Standard] ROK Army Reservist Live Fire Assessment Guidelines",
    apiSourceUrl: "https://www.army.mil.kr",
    apiIcon: "shield",
    isApi: true,
    widgetType: "EP2_SHOOTING_RANGE"
  },

  // [SCENE 11] 제2과목: 생명을 살리는 CPR & 마일즈 교전
  {
    bg: "assets/exam_room.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "완벽한 탄착군으로 사격 합격! 이어서 일상 속 소중한 생명을 살리는 [심폐소생술(CPR) & AED 평가]입니다!\n\n심정지 환자 발견 시 골든타임은 단 4분! 분당 올바른 흉부 압박 속도를 선택해 보세요!",
    text_en: "Perfect shot group, marksmanship passed! Next is lifesaving [CPR & AED Assessment]!\n\nThe golden time for cardiac arrest is just 4 minutes! Select the correct compression rate per minute!",
    apiSource: "[보건 안전] 질병관리청 & 대한심폐소생협회 2025 한국형 심폐소생술 가이드라인",
    apiSource_en: "[Safety] KDCA & Korean Association of Cardiopulmonary Resuscitation Guidelines",
    apiSourceUrl: "https://www.kacpr.org",
    apiIcon: "book-open",
    isApi: true,
    widgetType: "EP2_CPR_QUIZ"
  },

  // [SCENE 12] 점심시간 PX(군마트) 털기 & 면세 혜택
  {
    bg: "assets/lobby.jpg",
    char: "assets/minwoo_smile.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "전 종목 합격 완료! 그리고 드디어 찾아온 점심시간...!\n동기가 무조건 달려가야 한다던 국군복지단 군마트(PX) 문이 열렸다!\n\n달팽이 크림, 홍삼, 마스크팩... 시중가 70% 할인이라니 가족들 선물로 쓸어 담아야겠어!",
    text_en: "Passed all courses! And finally, lunch break has arrived...!\nThe Military PX which my buddy urged me to run to is now open!\n\nSnail cream, red ginseng, moisture facial masks... 70% off retail prices! Gotta grab them for family gifts!",
    apiSource: "[API] 공공데이터포털: 국군복지단_군마트(PX) 취급품목 및 면세 할인 정보 Open API",
    apiSource_en: "[API] Public Data Portal: Welfare Agency Military Mart (PX) Products & Duty-Free Discounts API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP2_PX_SHOPPING"
  },

  // [SCENE 13] 16:00 조기퇴소 선언 & 실시간 훈련보상비 입금
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "축하합니다! 전 종목 합격으로 [16:00 1조 조기퇴소] 확정!\n\n퇴소와 동시에 아침에 등록하신 본인 계좌로 실거리 교통비와 급식비를 포함한 [훈련보상비 16,000원]이 실시간으로 입금되었습니다!",
    text_en: "Congratulations! With all subjects passed, you are confirmed for [16:00 Squad 1 Early Dismissal]!\n\nUpon gate exit, your [Training Compensation Allowance of 16,000 KRW] has been directly deposited into your bank account!",
    apiSource: "[API] 공공데이터포털: 국방부/병무청_예비군 훈련보상비 지급 기준 Open API",
    apiSource_en: "[API] Public Data Portal: MND/MMA Reservist Allowance Standards Open API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 14] 청년 권익보장 '예비군법 제10조의2' 사이다 해설
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "귀가하시기 전 가장 중요한 권익 보호 꿀팁!\n\n학교 교수의 결석 처리나 직장 상사의 연차 강요가 걱정되시나요?\n대한민국 「예비군법」 제10조의2에 따라 예비군 훈련 참가로 인한 불이익 처우는 [2년 이하 징역 또는 2천만원 이하 벌금]으로 엄벌됩니다!",
    text_en: "Most crucial rights-protection tip before you head home!\n\nWorried about professors marking you absent or employers forcing annual leave?\nUnder Article 10-2 of Korea's Reserve Forces Act, disadvantageous treatment is punishable by [Up to 2 Years Imprisonment or 20M KRW Fine]!",
    apiSource: "[근거 법령] 국가법령정보센터: 「예비군법」 제10조의2(학업 및 직장의 보장) 및 제15조(벌칙)",
    apiSource_en: "[Law] Reserve Forces Act Art 10-2 (Protection of Study & Workplace) & Art 15 (Penalties)",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: "EP2_LAW_RIGHTS"
  },

  // [SCENE 15] 최종 엔딩 & 모바일 전자 교육필증 발급 카드
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_smile.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "e-병무지갑 앱에서 [전자 교육필증]이 바로 발급되니까 학교 포털에 업로드만 하면 출석 인정 끝이네!\n\n오늘 조기퇴소하고, PX 득템하고, 훈련비도 받고, 법률 상식까지... 예비군 훈련이 이렇게 알찰 줄 몰랐어!\n힘찬아 정말 고마워!",
    text_en: "Since the [Digital Training Certificate] is generated right inside the e-Wallet app, uploading to university portal guarantees attendance!\n\nEarly dismissal, PX discount haul, allowance paid, plus legal rights... Reservist training was surprisingly fulfilling!\nThank you so much, Himchan!",
    apiSource: "[정책 연계] 병무청 스마트 e-병무지갑 디지털 교육필증 및 청년 권익보장 서비스",
    apiSource_en: "[Policy] MMA Smart e-Wallet Digital Certificate & Youth Rights Protection",
    apiSourceUrl: "https://mw.mma.go.kr",
    apiIcon: "book-open",
    isApi: true,
    widgetType: "EP2_FINAL_REPORT"
  }
];

// 전역 객체 등록
if (typeof window !== "undefined") {
  window.SCENARIOS_EP2 = SCENARIOS_EP2;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCENARIOS_EP2 };
}
