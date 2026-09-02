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
    speaker_en: "Minwoo Kim (Protagonist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "드디어 올 게 왔네...\n다음 주 수요일에 검사받으러 오라는데,\n그날 대학교 중간고사 첫날이잖아? 꼭 이 날짜에 가야 하는 건가...",
    text_en: "It's finally here...\nIt says I have to take the draft physical exam next Wednesday, but isn't that the first day of university midterms? Do I really have to go on this exact date...?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 1] 민우의 자취방 - 힘찬이 등장 & 일정 변경 제안
  {
    bg: "assets/room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "충성! 안녕하십니까 민우 님, 병무청 AI 가이드 '힘찬이'입니다!\n\n많은 청년들이 잘 모르시는데, 병역판정검사는 공석만 있다면\n통지된 날짜와 상관없이 희망일 전날까지 원하는 날짜로 100% 자유롭게 변경할 수 있습니다.\n\n민우 님 지역 관할 병무청의 [월별 실시간 잔여석 달력]을 확인해 보시겠습니까?",
    text_en: "Salute! Hello Minwoo, I'm 'Himchan', your Military Manpower Administration AI guide!\n\nMany young citizens don't know this, but as long as there are vacancies, you can freely change your draft physical exam date 100% online up to 1 day before your desired date regardless of the notice.\n\nWould you like to check the [Monthly Real-time Vacancy Calendar] for your regional MMA office?",
    apiSource: "공공데이터포털: 병무청_병역판정 신체검사 정보 Open API",
    apiSource_en: "Public Data Portal: MMA Draft Physical Exam Info Open API",
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
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "거주하고 계신 지역을 선택하시면,\n해당 지방병무청의 실시간 잔여석 달력을 바로 띄워드릴게요!",
    text_en: "Select the region you reside in, and I will immediately open the real-time vacancy calendar for your regional Military Manpower Administration!",
    apiSource: "공공데이터포털: 병무청_지방병무청별_일자별_수검공석현황 API",
    apiSource_en: "Public Data Portal: MMA Regional Office Daily Vacancy API",
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
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "탁월한 선택입니다! 민우 님께서 고르신 [ {examDate} ]은 현재 실시간 잔여석이 있어 실제 예약이 가능한 일정입니다.\n\n실제 예약을 위해 병무청 민원포털로 이동하시기 전, 민원 신청서에 기입할 신청 내용을 자동으로 정리해 드릴까요?\n\n원클릭으로 복사하여 병무청 누리집(mwpt.mma.go.kr)에 그대로 붙여넣으시면 매우 편리합니다!",
    text_en: "Excellent choice! The date you selected [ {examDate} ] currently has real-time vacancies available for actual reservation.\n\nBefore heading to the MMA portal to make the real reservation, would you like me to organize your application details automatically?\n\nYou can copy it with a single click and paste it directly into the MMA website (mwpt.mma.go.kr) for convenience!",
    apiSource: "공공데이터포털: 병무청_지방병무(지)청 조직 및 부서별 연락처 Open API",
    apiSource_en: "Public Data Portal: MMA Regional Offices & Contact Info Open API",
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
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "일정이 정해졌으니, 검사 당일 헛걸음하지 않도록\n민우 님의 몸 상태에 맞는 맞춤형 구비서류를 미리 챙겨볼까요?\n\n평소 앓고 계신 질환이나 수술 이력이 있으신가요?",
    text_en: "Now that the schedule is set, let's check the customized required documents tailored to your medical history so you won't have to make a wasted trip.\n\nDo you have any pre-existing medical conditions or past surgeries?",
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) [별표 2]",
    apiSource_en: "National Law Information Center: 「MMA Physical Examination Rules」(Defense Ministry Ordinance)",
    apiIcon: "scale",
    isApi: true,
    widgetType: "HEALTH_CHECK_CHOICE"
  },

  // [SCENE 5] 병무청 1층 로비 - 검사장 도착 & 나라사랑카드 등록
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "드디어 검사 당일!\n{region} 1층 로비 접수데스크에 도착했습니다.\n\n먼저 오늘 검사 여비(교통비/식비)와 군 복무 월급을 입금받을 나라사랑카드를 선택·등록해 주세요.",
    text_en: "Finally, the day of the exam!\nYou've arrived at the 1st floor lobby reception desk of {region}.\n\nFirst, please select and register the Nara Sarang Card that will receive today's travel expense (transit/meal allowance) and your military service salary.",
    apiSource: "공공데이터포털: 병무청_나라사랑카드 금융연계 서비스 API",
    apiSource_en: "Public Data Portal: MMA Nara Sarang Card Financial Linkage Service API",
    apiIcon: "database",
    isApi: true,
    widgetType: "NARA_CARD_CHOICE"
  },

  // [SCENE 6] 1층 탈의실 및 사물함실 - 나라사랑카드 지참 & 검사복 환복
  {
    bg: "assets/locker_room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "탈의실로 이동했습니다!\n소지품을 배정된 사물함에 보관하고 전용 검사복(상·하의)으로 환복해 주세요.\n\n발급받은 [나라사랑카드]는 검사복 주머니에 꼭 챙겨주세요! 모든 검사실(심리검사, 채혈, 신체계측, 전문의 진료 등)에 들어갈 때마다 리더기에 카드를 태그하게 됩니다.\n환복을 마치셨다면 2층 심리검사실로 이동해 볼까요?",
    text_en: "We've moved to the locker room!\nStore your belongings in your assigned locker and change into the official examination uniform.\n\nBe sure to keep your registered [Nara Sarang Card] in your pocket! You will tag this card at electronic readers whenever entering each exam room.\nOnce you've changed, shall we head up to the 2nd floor psychological testing room?",
    apiSource: "국가법령정보센터: 「병역법」 및 병역판정검사 수검 절차 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 & Physical Exam Procedures",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LOCKER_CHANGE_CONFIRM"
  },

  // [SCENE 7] 2층 심리검사실 (전산실) - 1차 인성 및 인지능력 검사
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "심리상담관 NPC",
    speaker_en: "Psychological Counselor NPC",
    plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
    text: "병역판정검사의 본격적인 첫 순서는 '심리검사'입니다.\n\n좌석 모니터 화면에 나오는\n1차 인성 및 인지능력 검사 문항을 솔직하게 답변해 주세요.",
    text_en: "The first official step of the draft physical exam is the 'Psychological Test'.\n\nPlease answer the personality and cognitive aptitude test questions on the computer monitor honestly.",
    apiSource: "국가법령정보센터: 「병역법」 제11조 및 병역판정 심리검사 운영 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 Art. 11 & Psychological Testing Regulations",
    apiIcon: "scale",
    isApi: true,
    widgetType: "PSYCH_TEST_UI"
  },

  // [SCENE 8] 임상병리검사실 및 영상의학실 - 채혈·소변검사 & 흉부 X-ray
  {
    bg: "assets/lab_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "임상병리사 NPC",
    speaker_en: "Clinical Pathologist NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    text: "간기능, 혈당, 단백뇨 등을 확인하기 위해 소변 검사와 채혈을 진행하고, 흉부 X-ray 촬영을 마쳤습니다.\n\n이제 자동 신체계측실로 이동하여\n키와 몸무게(BMI), 혈압을 측정하겠습니다.",
    text_en: "We have collected urine and blood samples to check liver function, blood sugar, and proteinuria, and completed your chest X-ray.\n\nNow, let's move to the automated biometric measurement room to measure your height, weight (BMI), and blood pressure.",
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」 [별표 1] 신장·체중 판정기준",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 [Table 1] Height & Weight Standards",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LAB_ROOM_CONFIRM"
  },

  // [SCENE 9] 자동 신체계측실 - 신장/체중/혈압 & BMI 계산기
  {
    bg: "assets/body_measure_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "의무관 NPC",
    speaker_en: "Medical Officer NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    text: "측정 발판에 올라서 주세요.\n\n본인의 키와 몸무게를 입력해\n실시간 BMI 체질량지수 판정을 확인해 보세요!",
    text_en: "Please step onto the measurement platform.\n\nEnter your height and weight to check your real-time BMI Body Mass Index evaluation!",
    apiSource: "국가법령정보센터: 「검사규칙」 [별표 1] 및 신장·체중 불시 재측정 규정",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 [Table 1] & Random Re-measurement Policy",
    apiIcon: "scale",
    isApi: true,
    widgetType: "BMI_CALCULATOR"
  },

  // [SCENE 10] 전문의 정밀 진료실 - 정형외과 세부 진료
  {
    bg: "assets/doctor_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "정형외과 전담의사 NPC",
    speaker_en: "Orthopedic Specialist Doctor NPC",
    plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
    text: "제출하신 병무용 진단서와 관절 수술기록지, 최근 MRI 영상 CD를 면밀히 검토했습니다.\n\n관절 동요도 정밀 측정 결과, 국방부령 [별표 2] 기준에 부합하여\n정형외과 4급(보충역) 소견으로 수석판정관실에 상신합니다.",
    text_en: "I have carefully reviewed your military medical certificate, surgical records, and recent MRI/X-ray imaging disc.\n\nBased on joint instability testing conforming to Defense Ministry standards [Table 2] item 204, I am referring you to the Chief Adjudicator with a Grade 4 (Supplemental Service) recommendation.",
    apiSource: "국가법령정보센터: 「검사규칙」(국방부령) 제11조 및 [별표 2] 204호",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」(Defense Ministry Ordinance) Art. 11 & Table 2",
    apiIcon: "scale",
    isApi: true,
    widgetType: "DOCTOR_ROOM_CONFIRM"
  },

  // [SCENE 11] 1층 로비 및 수석판정관실 - 최종 판정, 여비 정산 & 정책 홍보
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "김민우 님, 최종 [ {finalGrade}, {disposition} ]으로 판정되었습니다!\n\n오늘 {region} 수검에 따른 여비는 [ {fare} ]이 {cardType} 계좌로 즉시 입금 처리되었습니다.\n\n귀가하시기 전에 e-병무지갑과 병역진로설계센터 혜택을 꼭 확인하세요!",
    text_en: "Minwoo Kim, you have received a final adjudication of [ {finalGrade}, {disposition} ]!\n\nYour travel expense of [ {fare} ] for attending {region} has been deposited into your {cardType} account.\n\nBefore you head home, be sure to check the benefits of the e-Military Wallet and Military Career Design Center!",
    apiSource: "공공데이터포털: 병무청_병역의무자 여비 지급 기준 데이터 (실시간 산정)",
    apiSource_en: "Public Data Portal: MMA Travel Allowance Standards (Real-time Calculation)",
    apiIcon: "database",
    isApi: true,
    widgetType: "FINAL_SUMMARY_CARDS"
  }
];
