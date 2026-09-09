/**
 * =========================================================================
 * 📜 [병무청 비주얼 노벨 제2화 - 전체 시나리오 대본 데이터 (scenario_ep2.js)]
 * =========================================================================
 * 
 * 🎮 제2화: 「힘찬이와 함께하는 슬기로운 예비군 라이프」
 * 
 * 💡 시나리오 흐름:
 * 0. [ep2_room.jpg] 알림톡 수신: 첫 예비군 통지서 도착 & 멘붕 (ep2_hero_nervous)
 * 1. [ep2_room.jpg] 민우의 절망: 중간고사 시험과 훈련 일정 충돌 (ep2_hero_nervous)
 * 2. [ep2_room.jpg] 힘찬이 등장: 예비군 수호천사 & 신분 판별 위젯 (himchan_smile)
 * 3. [ep2_room.jpg] 대학생 방침보류 8시간 안내 (himchan_cheer)
 * 4. [ep2_room.jpg] 전국단위 훈련 신청 & 캘린더 선택기 (himchan_smile)
 * 5. [ep2_room.jpg] D-1 전날 밤 군복 피팅 참사 (ep2_hero_nervous)
 * 6. [ep2_room.jpg] 피복 무료 대여 예약 & D-1 체크리스트 (ep2_assistant_polite)
 * 7. [ep2_shuttle_stop.jpg] 훈련 당일 아침: 09시 지각 위기 (ep2_hero_nervous)
 * 8. [ep2_shuttle_stop.jpg] 지자체 무료 셔틀버스 탑승 & 노선 위젯 (ep2_hero_uniform)
 * 9. [ep2_auditorium.jpg] 과학화 훈련장 입소 & 교관의 16시 조기퇴소 브리핑 (ep2_instructor_strict)
 * 10. [ep2_shooting_range.jpg] 제1과목: 실탄 영점사격 미니게임 (ep2_hero_confident)
 * 11. [ep2_cpr_lab.jpg] 제2과목: 생명을 살리는 CPR/AED & 마일즈 교전 (ep2_cpr_instructor)
 * 12. [ep2_px_mart.jpg] 점심시간 PX(군마트) 털기 & 꿀템 쇼핑 (ep2_donghyun_excited)
 * 13. [ep2_camp_gate.jpg] 16:00 조기퇴소 환호 & 실시간 교통비 입금 (ep2_instructor_salute)
 * 14. [ep2_bus_sunset.jpg] 청년 권익보장 '예비군법 제10조의2 & 10조의3' 사이다 (himchan_cheer)
 * 15. [ep2_bus_sunset.jpg] 모바일 전자 교육필증 발급 & 최종 엔딩 (ep2_hero_happy)
 */

const SCENARIOS_EP2 = [
  // [SCENE 0] 민우의 자취방 - 스마트폰 알림톡과 첫 소집통지서
  {
    bg: "assets/ep2_room.jpg",
    char: "assets/ep2_hero_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "으음... 아침부터 웬 알림톡이지? 택배인가?\n\n[병무청·국방부] {name} 님, 2026년도 예비군 훈련 소집통지서가 도착했습니다.\n...뭐?! 예비군 통지서?! 나 만기 전역한 지 1년밖에 안 됐는데 벌써 예비군이라고?!",
    text_en: "Ugh... What's this morning alert? A delivery package?\n\n[MMA & MND] {name}, your 2026 Reservist Training Notice has arrived.\n...Wait, WHAT?! Reservist notice already?! I just discharged a year ago!",
    apiSource: "[통지] 병무청 스마트 알림톡 & e-병무지갑 전자고지 시스템 연계",
    apiSource_en: "[Notice] MMA Smart Notification & e-Wallet Electronic Notice System",
    apiSourceUrl: "https://mw.mma.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 1] 민우의 절망 - 시험기간과 훈련 일정의 충돌
  {
    bg: "assets/ep2_room.jpg",
    char: "assets/ep2_hero_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "잠깐만... 소집 일자가 다음 주 10월 15일 목요일이잖아?!\n그날 우리 학과 전공 중간고사 시험 당일인데 어떡하지?!\n설마 전역하고도 또 2박 3일 동안 산속 군부대로 끌려가서 자야 하는 건가...?",
    text_en: "Wait... It says next Thursday, October 15th?!\nThat's the exact day of my major midterm exam!\nAm I really being dragged back into mountain barracks for 2 nights and 3 days...?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 2] 힘찬이 등장 - 예비군 수호천사로 변신 & 신분 판별
  {
    bg: "assets/ep2_room.jpg",
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
    bg: "assets/ep2_room.jpg",
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
    bg: "assets/ep2_room.jpg",
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
    bg: "assets/ep2_room.jpg",
    char: "assets/ep2_hero_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "으아아악! 지퍼가 안 올라가! 단추가 터질 것 같아...!\n전역하고 야식을 너무 많이 먹었나 봐. 바지 허리가 5cm나 모자라잖아?!\n\n게다가 전투모는 어디 처박혔는지 보이지도 않고, 고무링도 없어! 복장 불량이면 쫓겨나는 거 아냐?!",
    text_en: "Arghhh! The zipper won't zip! The button is about to burst...!\nI guess I ate way too much late-night snacks after discharge. The waist is 5cm too tight?!\n\nAnd where on earth is my cap? No blousing straps either! Am I getting expelled for uniform violation?!",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 6] 피복 무료 대여 조교의 친절한 안내 & D-1 체크리스트
  {
    bg: "assets/ep2_room.jpg",
    char: "assets/ep2_assistant_polite.png",
    charPos: "right",
    speaker: "이 일병 (피복보급 조교)",
    speaker_en: "Private Lee (Supply Assistant)",
    plateClass: "from-emerald-800 to-slate-900 border-emerald-500/40",
    text: "예비군 선배님, 충성! 전국의 모든 예비역 선배님들이 겪으시는 고민이니 걱정 마십시오!\n\n국방부 예비군 교육훈련 훈령에 따라 훈련장 안내데스크에서 [전투복·전투화·요대(벨트)·방한모를 100% 무료 대여]해 드립니다!\n신분증만 챙겨오시면 선배님 치수에 딱 맞는 깨끗한 새 군복으로 현장 교환해 드리겠습니다!",
    text_en: "Salute, Senior Reservist! Don't worry at all, this is a universal concern for all veterans!\n\nUnder MND Reservist Orders, our supply desk provides [100% Free Rental for Uniforms, Boots, Belts & Caps]!\nJust bring your ID, and we'll instantly hand you a crisp uniform tailored to your exact measurements!",
    apiSource: "[근거 훈령] 국가법령정보센터: 「국방부 예비군 훈련 관리 훈령」(피복 및 장구류 무료 대여 규정)",
    apiSource_en: "[Regulation] MND Reservist Training Administrative Order (Free Uniform & Equipment Rental)",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: "EP2_D1_CHECKLIST"
  },

  // [SCENE 7] 훈련 당일 아침 - 셔틀버스 승강장 & 지각 위기
  {
    bg: "assets/ep2_shuttle_stop.jpg",
    char: "assets/ep2_hero_nervous.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "현재 시각 8시 20분... 전철역엔 도착했는데 산속 훈련장까지 대중교통이 애매하잖아?!\n9시 정각에서 1분만 늦어도 위병소 철문 닫히고 '무단 불참' 처리된다는데...\n지각하면 고발당하는 거 아니야?!",
    text_en: "Current time 8:20 AM... I reached the subway station, but transit to the base is confusing?!\nThey said if you're even 1 minute late past 9:00 AM, gates shut and you're marked absent...\nIf I'm late, do I face legal charges?!",
    apiSource: "[벌칙 법령] 「예비군법」 제15조: 정당한 사유 없이 훈련 불참 시 1년 이하 징역 또는 1천만원 이하 벌금",
    apiSource_en: "[Penalty] Reserve Forces Act Art 15: Absence without legitimate grounds subject to criminal penalty",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: null
  },

  // [SCENE 8] 힘찬이의 지자체 무료 셔틀버스 탑승 & 세이프 출격
  {
    bg: "assets/ep2_shuttle_stop.jpg",
    char: "assets/ep2_hero_uniform.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "출구 바로 앞을 보니 병무청과 지자체가 운행하는 [예비군 전용 무료 셔틀버스]가 대기 중이었어!\n\n08시 30분 셔틀에 탑승하니 15분 만에 위병소 앞 도착 완료!\n피복 대여소에서 105 사이즈 새 군복으로 갈아입으니 현역 시절 늠름한 각이 다시 살아나는걸?!",
    text_en: "Right outside the exit, the [Free Reservist Direct Shuttle Bus] was standing by!\n\nBoarding at 8:30 AM brought me to the camp gates in just 15 minutes!\nSwapping into a fresh size-105 uniform at the supply desk, my active-duty sharpness is back!",
    apiSource: "[API] 공공데이터포털: 지자체별 과학화 예비군훈련장 무료 수송 셔틀버스 실시간 운행정보 API",
    apiSource_en: "[API] Public Data Portal: Local Government Scientific Camp Free Shuttle Real-time Transit API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP2_SHUTTLE_ROUTE"
  },

  // [SCENE 9] 과학화 예비군훈련장 입소 & 교관의 조기퇴소 선언
  {
    bg: "assets/ep2_auditorium.jpg",
    char: "assets/ep2_instructor_strict.png",
    charPos: "right",
    speaker: "최 중사 (정예 훈련 교관)",
    speaker_en: "Sergeant First Class Choi (Lead Instructor)",
    plateClass: "from-emerald-800 to-teal-900 border-emerald-500/40",
    text: "예비군 여러분, 환영합니다! 본 과학화 훈련장은 10인 1조 분대별 [자율참여형 측정식 평가]로 진행됩니다.\n\n사격, 영상 모의교전, 응급처치 등 전 종목을 합격한 최우수 분대에게는\n국방부 예비군 지침에 따라 [16:00 조기퇴소] 혜택이 주어집니다!",
    text_en: "Welcome, Reservists! This scientific center conducts [Self-Participatory Measurable Assessments] by 10-person squads.\n\nSquads that pass all subjects including shooting, simulation, and first aid\nwill be granted [16:00 Early Dismissal] per MND Regulations!",
    apiSource: "[근거 규정] 국방부 과학화 예비군훈련장 측정식 합격 및 우수 분대 조기퇴소 지침",
    apiSource_en: "[Rule] MND Scientific Training Evaluation & Early Dismissal Directives",
    apiSourceUrl: "https://www.mnd.go.kr",
    apiIcon: "book-open",
    isApi: true,
    widgetType: null
  },

  // [SCENE 10] 제1과목: 실탄 영점사격 미니게임 (자신만만한 민우)
  {
    bg: "assets/ep2_shooting_range.jpg",
    char: "assets/ep2_hero_confident.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "16시 조기퇴소라니, 분대원 여러분 저만 믿으십시오!\n첫 번째 관문은 [실탄 영점사격 (3발)]!\n\n숨을 멈추고 표적지 중앙을 조준한다... 탕! 탕! 탕! 완벽한 동전 크기 탄착군 형성 완료!",
    text_en: "Early dismissal at 16:00? Squad members, trust me on this!\nFirst stage is [Zero-ing Live Fire Shooting (3 rounds)]!\n\nHolding my breath, aiming dead center... Bang! Bang! Bang! Perfect coin-sized shot group formed!",
    apiSource: "[평가 기준] 육군 표준 예비군 실탄사격 측정 및 안전관리 지침",
    apiSource_en: "[Standard] ROK Army Reservist Live Fire Assessment Guidelines",
    apiSourceUrl: "https://www.army.mil.kr",
    apiIcon: "shield",
    isApi: true,
    widgetType: "EP2_SHOOTING_RANGE"
  },

  // [SCENE 11] 제2과목: 생명을 살리는 CPR & 마일즈 시가지전투
  {
    bg: "assets/ep2_cpr_lab.jpg",
    char: "assets/ep2_cpr_instructor.png",
    charPos: "right",
    speaker: "박 상사 (응급처치 전문관)",
    speaker_en: "Master Sergeant Park (Paramedic Instructor)",
    plateClass: "from-rose-800 to-slate-900 border-rose-500/40",
    text: "사격 합격을 축하합니다! 이어서 일상 속 소중한 생명을 살리는 [심폐소생술(CPR) & AED 평가]입니다!\n\n심정지 환자 발견 시 골든타임은 단 4분! 분당 올바른 흉부 압박 속도를 선택해 보십시오!\n(이어진 마일즈 레이저 시가지 교전에서도 김민우 분대가 적 진지를 제압하며 만점 통과!)",
    text_en: "Congratulations on passing shooting! Next is lifesaving [CPR & AED Assessment]!\n\nThe golden time for cardiac arrest is just 4 minutes! Select the correct compression rate per minute!\n(Following into the MILES laser urban combat, Squad Minwoo neutralized all targets with full marks!)",
    apiSource: "[보건 안전] 질병관리청 & 대한심폐소생협회 2025 한국형 심폐소생술 가이드라인",
    apiSource_en: "[Safety] KDCA & Korean Association of Cardiopulmonary Resuscitation Guidelines",
    apiSourceUrl: "https://www.kacpr.org",
    apiIcon: "book-open",
    isApi: true,
    widgetType: "EP2_CPR_QUIZ"
  },

  // [SCENE 12] 점심시간 PX(군마트) 털기 & 면세 혜택 (동현이의 신남)
  {
    bg: "assets/ep2_px_mart.jpg",
    char: "assets/ep2_donghyun_excited.png",
    charPos: "right",
    speaker: "박동현 (예비역 동기)",
    speaker_en: "Donghyun Park (Reservist Buddy)",
    plateClass: "from-amber-700 to-slate-900 border-amber-500/40",
    text: "민우야 밥 다 먹었으면 뛰어! 지금 국군복지단 군마트(PX) 문 열렸어!\n예비군 와서 PX 안 털고 가는 건 유죄라고!\n\n시중가 3만원짜리 달팽이 크림이 7천원, 홍삼이 1만원대야! 부모님 여자친구 선물 싹 쓸어 담자!",
    text_en: "Minwoo, done eating? Run! The Military PX is open now!\nGoing to reservist training and skipping the PX is a crime!\n\nSnail cream retailing at 30k KRW is just 7k here, red ginseng 10k! Let's haul gifts for parents and girlfriends!",
    apiSource: "[API] 공공데이터포털: 국군복지단_군마트(PX) 취급품목 및 면세 할인 정보 Open API",
    apiSource_en: "[API] Public Data Portal: Welfare Agency Military Mart (PX) Products & Duty-Free Discounts API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP2_PX_SHOPPING"
  },

  // [SCENE 13] 16:00 조기퇴소 선언 & 실시간 훈련보상비 입금 (교관의 호쾌한 미소)
  {
    bg: "assets/ep2_camp_gate.jpg",
    char: "assets/ep2_instructor_salute.png",
    charPos: "right",
    speaker: "최 중사 (정예 훈련 교관)",
    speaker_en: "Sergeant First Class Choi (Lead Instructor)",
    plateClass: "from-emerald-800 to-teal-900 border-emerald-500/40",
    text: "알립니다! 전 종목 만점 통과한 제3분대({name} 분대장 외 9명)는 16:00부로 조기퇴소 조치합니다!\n\n오늘 든든히 드신 점심(8,000원 상당 도시락)은 현물 무상 지원되었고,\n퇴소와 동시에 등록하신 본인 계좌로 [실거리 교통비 8,000원]이 실시간 입금 완료되었습니다! 수고하셨습니다!",
    text_en: "Attention! Squad 3 (Squad Leader {name} and 9 others) passed all courses with top marks and are dismissed early at 16:00!\n\nYour hearty lunch (worth 8,000 KRW) was provided in-kind for free,\nand your [Direct Transit Allowance of 8,000 KRW] has been immediately deposited into your bank account! Outstanding work!",
    apiSource: "[API] 공공데이터포털: 국방부/병무청_예비군 훈련보상비 및 급식 지원 기준 Open API",
    apiSource_en: "[API] Public Data Portal: MND/MMA Reservist Allowance & Meal Support Standards Open API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 14] 귀가 버스 안 - 청년 권익보장 '예비군법 제10조의2 & 제10조의3' 사이다 해설
  {
    bg: "assets/ep2_bus_sunset.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "귀가하시기 전 가장 중요한 청년 권익 보호 꿀팁!\n\n학교 교수의 결석 처리나 직장의 연차 강요가 걱정되시나요?\n대한민국 「예비군법」 제10조의2(직장 보장) 및 제10조의3(학업 보장)에 따라,\n예비군 훈련 참가로 인한 불이익 처우는 [2년 이하 징역 또는 2천만원 이하 벌금]으로 엄벌됩니다!",
    text_en: "Most crucial youth rights-protection tip before heading home!\n\nWorried about professors marking you absent or employers forcing paid leave?\nUnder Articles 10-2 (Workplace) & 10-3 (Academic Protection) of the Reserve Forces Act,\ndisadvantageous treatment is strictly punished by [Up to 2 Years Prison or 20M KRW Fine]!",
    apiSource: "[근거 법령] 국가법령정보센터: 「예비군법」 제10조의2(직장 보장), 제10조의3(학업 보장) 및 제15조(벌칙)",
    apiSource_en: "[Law] Reserve Forces Act Art 10-2 (Workplace), Art 10-3 (Academic Protection) & Art 15 (Penalties)",
    apiSourceUrl: "https://www.law.go.kr",
    apiIcon: "scale",
    isApi: true,
    widgetType: "EP2_LAW_RIGHTS"
  },

  // [SCENE 15] 최종 엔딩 & 모바일 전자 교육필증 발급 카드 (환호하는 민우)
  {
    bg: "assets/ep2_bus_sunset.jpg",
    char: "assets/ep2_hero_happy.png",
    charPos: "right",
    speaker: "{name} (예비역 병장)",
    speaker_en: "{name} (Reservist Sergeant)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "e-병무지갑 앱에서 [전자 교육필증]이 바로 발급되니까 학교 포털에 업로드만 하면 출석 인정 끝이네!\n\n오늘 4시에 조기퇴소하고, PX에서 10만원 아끼고, 훈련비도 받고, 법률 상식까지 완벽 마스터...!\n예비군 훈련이 이렇게 알차고 뿌듯할 줄 몰랐어! 힘찬아, 내년 2년 차 예비군도 너만 믿는다!",
    text_en: "Since the [Digital Training Certificate] is generated right inside the e-Wallet app, uploading to university portal guarantees attendance!\n\nEarly dismissal at 16:00, saved 100k KRW at PX, got my allowance, and mastered my legal rights...!\nReservist training was surprisingly fulfilling! Thank you Himchan, count on you for Year 2!",
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
