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
  // [SCENE 0] 민우의 자취방 - 통지서 수령 (당황하고 긴장한 민우)
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_nervous.png",
    charPos: "right",
    speaker: "{name} (주인공)",
    speaker_en: "{name} (Protagonist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "드디어 올 게 왔네...\n다음 주 수요일에 검사받으러 오라는데,\n그날 대학교 중간고사 첫날이잖아? 꼭 이 날짜에 가야 하는 건가...",
    text_en: "It's finally here...\nIt says I have to take the draft physical exam next Wednesday, but isn't that the first day of university midterms? Do I really have to go on this exact date...?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: null
  },

  // [SCENE 1] 민우의 자취방 - 힘찬이 첫 등장 & 관할 병무청 선택 요청 (반갑게 웃으며 인사)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "충성! 안녕하십니까 {name} 님, 병무청 AI 가이드 '힘찬이'입니다!\n\n병역판정검사 일정을 확인하고 계획하기 위해 {name} 님, 먼저 관할 병무청을 선택해 주시겠습니까?",
    text_en: "Salute! Hello {name}, I'm 'Himchan', your Military Manpower Administration AI guide!\n\nTo check and plan your draft physical examination schedule, {name}, would you please select your regional Military Manpower Administration office first?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "DEFAULT_REGION_PICKER"
  },

  // [SCENE 2] 민우의 자취방 - 선택된 관할청의 일별 실시간 달력 확인 (안내하는 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "{name} 님이 선택하신 [{region}] (주민등록 주소지: {residentAddress})의 일별 실시간 공석 달력입니다!\n\n원하시는 검사 일자와 시간(오전/오후)을 자유롭게 선택해 보세요.\n주소지 기준 실거리({distanceKm})에 맞춘 당일 여비 지급 규정도 함께 연계됩니다.",
    text_en: "Here is the daily real-time vacancy calendar for your selected [{region}] (Address: {residentAddress})!\n\nPlease feel free to choose your desired exam date and time (AM/PM).\nThe travel allowance regulation based on actual distance ({distanceKm}) will also be linked.",
    apiSource: "[API] 공공데이터포털: 병무청_병역판정검사 공석 데이터 & 법제처: 「병역의무자 여비지급 규정」 Open API",
    apiSource_en: "[API] Public Data Portal: MMA Draft Exam Vacancies & Law Center: Military Service Travel Allowance Regulations Open API",
    apiSourceUrl: "https://www.data.go.kr/data/3064321/openapi.do",
    apiIcon: "database",
    isApi: true,
    widgetType: "REGION_CALENDAR_PICKER"
  },

  // [SCENE 3] 민우의 자취방 - 예약 확정 및 직통 연락처 (신나게 응원하는 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    customDialogues: [
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "오, {name} 님! 검사 희망일로 [{examDate}] 일정을 직접 선택하셨군요!\n\n선택하신 관할 지방병무청({region})의 해당 일자 실시간 공석에 맞춰 검사 일정이 성공적으로 지정되었습니다.",
        text_en: "Oh, {name}! You have selected [{examDate}] for your preferred exam date!\n\nYour exam schedule has been successfully booked to match the real-time vacancies at your regional office ({region})."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "원하는 날짜와 시간대로 직접 골라서 정하니까 마음이 훨씬 편하네!\n\n내가 신청한 내역과 관할 병무청 연락처를 미리 잘 확인해 둬야겠어.",
        text_en: "Choosing the exact date and time myself puts my mind so much more at ease!\n\nI should make sure to double check my application details and the regional office contact info."
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_smile.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "만약 검사 일정 변경이나 추가 문의사항이 있으실 경우,\n아래 관할 병무청 직통 연락처 또는 병무청 누리집 민원포털을 통해 언제든 간편하게 신청하고 변경하실 수 있습니다!",
        text_en: "If you need to change your exam schedule or have any questions,\nyou can easily apply or change it anytime via the regional office contact or the MMA Civil Petition Portal below!"
      }
    ],
    defaultDialogues: [
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_smile.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "네, {name} 님! 통지서에 지정된 기본 일정인 [{examDate}]으로 안내를 도와드리겠습니다!\n\n선택하신 관할 지방병무청({region})의 기본 배정 정보가 확인되었습니다.",
        text_en: "Yes, {name}! I will guide you with your notice's default date [{examDate}]!\n\nThe basic assignment information for your regional office ({region}) has been confirmed."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "통지서에 지정된 기본 날짜에 맞춰서 미리 일정을 비워두고 준비해야겠어!\n\n관할 병무청 연락처랑 검사장 위치를 잘 확인해 두자.",
        text_en: "I should clear my schedule and prepare according to the notice's assigned date!\n\nLet me double check the regional office contact and center location."
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "혹시라도 나중에 다른 날짜로 변경하고 싶으시면,\n검사 희망일 전날까지 아래 관할 병무청 직통 연락처나 병무청 민원포털에서 언제든 100% 자유롭게 변경하실 수 있으니 안심하세요!",
        text_en: "If you ever wish to change to a different date later,\nyou can freely change it 100% online up to 1 day before your desired date through the regional contact or portal below!"
      }
    ],
    dialogues: [],
    text: "통지서에 지정된 기본 일정인 [{examDate}]으로 안내를 도와드리겠습니다.\n\n만약 검사 일정 변경이나 추가 문의사항이 있으실 경우, 아래 관할 병무청 직통 연락처 또는 병무청 누리집 민원포털을 통해 간편하게 신청하실 수 있습니다.",
    text_en: "I will guide you with your notice's default date [{examDate}].\n\nIf you need to change your exam schedule or have any questions, you can easily apply through the regional office direct contact below or the MMA Civil Petition Portal.",
    apiSource: "[API] 공공데이터포털: 병무청_지방병무(지)청 조직 및 연락처 Open API",
    apiSource_en: "[API] Public Data Portal: MMA Regional Offices & Contact Info Open API",
    apiSourceUrl: "https://www.data.go.kr/data/3064321/openapi.do",
    apiIcon: "database",
    isApi: true,
    widgetType: "CONTACT_CARD"
  },

  // [SCENE 4] 민우의 자취방 - 맞춤형 서류 점검 (친절한 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "일정이 정해졌으니, 검사 당일 헛걸음하지 않도록 몸 상태에 맞는 맞춤형 구비서류를 미리 챙겨볼까요?\n\n많은 분들이 시력(근시·난시)이나 체중(BMI)도 진단서를 떼어가야 하는지 궁금해하시는데요,\n단순 시력(안경 착용)과 신장·체중은 병무청 자체 최첨단 장비로 현장에서 100% 직접 정밀 측정하므로 진단서나 서류가 전혀 필요 없습니다! (안경만 착용하고 오시면 됩니다.)\n\n반면, 과거 수술을 받았거나 6개월 이상 치료 중인 질환(관절, 척추, 기질적 안과 질환, 만성 내과 등)이 있으신 경우에는 공정한 판정을 위해 병무용 진단서와 의무기록(영상 CD 포함)을 지참하셔야 합니다. {name} 님은 해당사항이 있으신가요?",
    text_en: "Now that your schedule is set, let's check the required documents tailored to your medical history.\n\nMany ask if vision (myopia/astigmatism) or BMI requires a medical certificate. Simple vision correction (glasses) and BMI are measured directly on-site with MMA's advanced equipment, requiring NO medical certificate or documents!\n\nHowever, if you have a history of surgery or over 6 months of continuous treatment (joint/spine, ocular diseases, chronic internal medicine), you must bring a Military Medical Certificate and medical records (including MRI/CT CDs). Do any of these apply to you?",
    apiSource: "[API] 법제처 국가법령정보: 「병역판정 신체검사 등 검사규칙」(국방부령) [별표 1·3] Open API",
    apiSource_en: "[API] National Law Information Center: 「Physical Exam Rules」(Defense Ministry Ordinance) [Table 1 & 3] Open API",
    apiSourceUrl: "https://www.law.go.kr/법령/병역판정신체검사등검사규칙",
    apiIcon: "scale",
    isApi: true,
    widgetType: "HEALTH_CHECK_CHOICE"
  },

  // [SCENE 5] 병무청 로비 - 가상 검사장 도착 & 본인인증 및 의무자 등록 (씩씩한 힘찬이)
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    dialogues: [
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "드디어 가상 {region} 로비 접수데스크에 도착했습니다!\n검사장에 오시면 가장 먼저 [본인인증 및 의무자 등록]을 진행해야 하는데요,\n① 신분증 본인 확인: 주민등록증, 운전면허증, 여권 등 공인 신분증을 접수창구에 제시하여 본인 여부를 철저히 대조 확인합니다.\n② 사진촬영: 대리검사를 방지하기 위해 디지털 사진을 현장에서 즉석 촬영합니다.\n③ 전용 검사복 수령: 등록이 완료되면 깨끗하게 소독된 신체검사 전용 검사복을 지급받습니다.\n지참하신 신분증을 제시하고 본인인증 및 사진촬영을 완료해 볼까요?",
        text_en: "We've arrived at the virtual {region} reception desk!\nUpon entering the center, the very first step is [Identity Verification & Examinee Registration]:\n① ID Verification: Present an official government photo ID to verify your identity.\n② Photo Capture: A real-time photo is taken on-site to prevent proxy exams.\n③ Exam Uniform Pickup: Upon registration, you receive sanitized physical examination clothing.\nShall we present your ID and complete the verification & photo capture?"
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "긴장되는데... 정면을 똑바로 바라보고 눈감지 말고 잘 찍어볼게요!",
        text_en: "I'm a bit nervous... I'll look straight at the camera and try not to blink!"
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "후우... 오랜만이라 긴장됐는데, 그래도 잘 나온 것 같아!",
        text_en: "Phew... I was quite tense since it's been a while, but it seems to have turned out well!"
      }
    ],
    apiSource: "[행정기준] 병역법 제11조(병역판정검사) 및 병역판정검사 규정 (공인 신분증 확인 및 사진촬영)",
    apiSource_en: "[Legal Basis] Military Service Act Article 11 & MMA Exam Regulations (Photo ID Verification & Photo Capture)",
    apiSourceUrl: "https://www.law.go.kr/법령/병역법",
    apiIcon: "shield-check",
    isApi: true,
    widgetType: "IDENTITY_REG_CONFIRM"
  },

  // [SCENE 6] 탈의실 및 사물함실 - 사물함 보관 & 검사복 환복 (미소 힘찬이)
  {
    bg: "assets/locker_room.jpg",
    char: "assets/himchan_smile.png",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    dialogues: [
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_smile.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "탈의실 및 사물함실로 이동했습니다!\n\n휴대폰, 지갑, 시계 등 모든 개인 소지품은 사물함에 넣고 편안한 전용 검사복으로 환복해 주세요.",
        text_en: "We've moved to the locker room!\n\nPlease store all personal belongings in the locker and change into the examination uniform."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "소지품은 사물함에 넣고... 아! 미리 챙겨온 병원 진단서(의무기록) 서류는 검사복 주머니에 꼭 챙겨야지!",
        text_en: "Belongings in locker... Oh! I must keep my medical certificate and records in my pocket!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "정확합니다 {name} 님! 환복을 마치셨다면 첫 번째 검사장인 [심리검사장]으로 출발해 볼까요?\n심리검사장 입구에서 오늘 검사의 필수 열쇠인 [나라사랑카드] 발급과 등록이 시작됩니다!",
        text_en: "Exactly right {name}! Now that you're in uniform, let's head to the [Psychological Testing Hall]!\nAt the entrance, your essential [Nara Sarang Card] registration and tests begin!"
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "LOCKER_CHANGE_CONFIRM"
  },

  // [SCENE 7] 심리검사장 - 나라사랑카드 발급·등록 및 PC 1:1 심리검사 (심리검사관 & 민우)
  {
    bg: "assets/exam_room.jpg",
    char: "assets/psychologist.png",
    speaker: "심리검사관 NPC",
    speaker_en: "Psychological Examiner NPC",
    plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
    dialogues: [
      {
        speaker: "심리검사관 NPC",
        speaker_en: "Psychological Examiner NPC",
        char: "assets/psychologist.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
        text: "안녕하십니까 {name} 님! 병역판정검사의 첫 관문인 [심리검사장]에 오신 것을 환영합니다.\n심리검사장에 들어서면 가장 먼저 진행하는 핵심 절차가 바로 [나라사랑카드 발급·등록]입니다!\n① 나라사랑카드: 주머니에 넣고 다니며, 임상병리, 기본검사, 각 과목 의사 진료실 입구 리더기에 '삑-' 태그하여 본인을 인증하고 검사 결과를 실시간 전산 기록합니다.\n② 당일 지급여비 수령: 오늘 검사가 끝나면 왕복 교통비와 식비 등 지급여비가 등록하신 이 계좌로 입금됩니다.\n③ 군 복무 & 예비군 복지: 복무 중 군 급여 수령, PX 최대 20% 할인, 그리고 전역 후 예비군 훈련 여비 지급까지 핵심 복지 카드로 쭉 사용하게 됩니다!\nKB국민과 IBK기업 두 은행의 혜택을 비교해 보시고 마음에 드는 나라사랑카드를 선택해 보세요.",
        text_en: "Welcome {name}! This is the Psychological Testing Hall, the first gateway of your physical examination.\nUpon entering, the very first essential step is [Nara Sarang Card Issuance & Registration]!\n① Nara Sarang Card: Kept in your pocket, tap this card at readers before entering each exam room (pathology, basic physical exam, doctor clinics) to verify identity and record results in real-time.\n② Travel Allowance: Transit and meal allowances will be deposited directly into this designated account upon exam completion.\n③ Military & Reserve Welfare: Used continuously for military salary, up to 20% PX discounts, and future Reserve Force training allowances!\nCompare the benefits and select your preferred Nara Sarang Card."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "나라사랑카드 혜택을 꼼꼼히 보고 선택해야겠어...!",
        text_en: "I should carefully check the Nara Sarang Card benefits before choosing...!"
      }
    ],
    apiSource: "[공식출처] 나라사랑포털(군인공제회C&C) & KB국민·IBK기업 공식 금융 혜택 공시 데이터",
    apiSource_en: "[Official Source] Nara Sarang Portal & Official Bank Benefits Disclosure Data",
    apiSourceUrl: "https://www.narasarang.or.kr",
    apiIcon: "credit-card",
    isApi: true,
    widgetType: "NARA_CARD_CHOICE"
  },

  // [SCENE 8] 임상병리검사실 및 영상의학실 - 소변·혈액 채취 & 흉부 X-ray
  {
    bg: "assets/lab_room.jpg",
    char: "assets/lab_officer.png",
    speaker: "임상병리사 NPC",
    speaker_en: "Clinical Pathologist NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    dialogues: [
      {
        speaker: "임상병리사 NPC",
        speaker_en: "Clinical Pathologist NPC",
        char: "assets/lab_officer.png",
        charPos: "right",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        text: "안녕하십니까! 이곳은 [임상병리검사실]입니다.\n\n간기능, 신장기능, 혈당, 단백뇨 등 체내 건강 상태를 정밀하게 확인하기 위해 소변검사와 채혈(혈액검사)을 진행합니다.\n\n검사실 앞 리더기에 [나라사랑카드]를 태그해 주세요.",
        text_en: "Welcome! This is the Clinical Pathology Lab.\n\nWe perform urine and blood tests. Please tap your [Nara Sarang Card] on the reader."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "여기서부터 나라사랑카드를 태그하는 거구나! 삑- 소변검사용 종이컵과 스틱을 받았어.",
        text_en: "This is where I tap my Nara Sarang Card! Beep- received urine cup and stick."
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "LAB_STEP1_POPUP"
  },

  // [SCENE 9] 기본검사실 - 신장/체중/혈압/시력 3단계 측정 & BMI 판정
  {
    bg: "assets/body_measure_room.jpg",
    char: "assets/medical_officer.png",
    speaker: "의무관 NPC",
    speaker_en: "Medical Officer NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    dialogues: [
      {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        char: "assets/medical_officer.png",
        charPos: "right",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        text: "{name} 님 들어오세요! 이곳은 [기본검사실]입니다.\n\n신장(키), 체중(몸무게), 혈압, 시력 등 기초 건강 상태를 정밀 계측하여 체질량지수(BMI)를 판정하는 곳입니다.",
        text_en: "{name}, please come in! This is the [Basic Examination Room].\n\nWe measure your height, weight, blood pressure, and eyesight to evaluate your Body Mass Index (BMI)."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "신체계측 발판 위에 올라서서 정자세로 바르게 서면 되는 거군요! 키와 몸무게를 정확히 재어보자.",
        text_en: "I just step onto the biometric platform and stand straight! Let's measure my height and weight accurately."
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "BIO_STEP1_POPUP"
  },

  // [SCENE 10] 전문의 정밀 진료실 - 사전 선택 질환(내과/천식, 정형외과, 안과, 일반) 맞춤형 정밀 진료
  {
    bg: "assets/doctor_room.jpg",
    char: "assets/doctor_serious.png",
    speaker: "과목별 전담의사 NPC",
    speaker_en: "Specialist Doctor NPC",
    plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
    clinicProfiles: {
      internal: {
        speaker: "내과 전담의사 NPC",
        speaker_en: "Internal Medicine Specialist Doctor NPC",
        dialogues: [
          {
            speaker: "내과 전담의사 NPC",
            speaker_en: "Internal Medicine Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "{name} 님 어서 오세요. 이곳은 [내과 전문의 정밀 진료실]입니다.\n\n수검자가 제출한 내과 의무기록과 투약 처방전, 폐기능검사 및 알레르기 유발검사 결과를 면밀히 검토하고 정밀 진료를 진행하는 곳입니다.",
            text_en: "Welcome, {name}. This is the [Internal Medicine Specialist Clinic].\n\nWe review your clinical records, medication prescriptions, pulmonary function test (PFT) and allergy test results."
          },
          {
            speaker: "{name} (주인공)",
            speaker_en: "{name} (Protagonist)",
            char: "assets/minwoo_nervous.png",
            charPos: "right",
            plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
            text: "선생님, 제가 평소 기관지 천식으로 6개월 이상 지속 투약 치료를 받아왔는데, 사전에 챙겨온 병무용 진단서와 의무기록사본, 투약 처방전을 여기 제출하면 될까요?",
            text_en: "Doctor, I have been taking medication for bronchial asthma for over 6 months. Should I submit my military medical certificate, clinical records, and prescriptions here?"
          },
          {
            speaker: "내과 전담의사 NPC",
            speaker_en: "Internal Medicine Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "네! 6개월 이상의 꾸준한 치료 경과와 폐기능 검사(PFT) 결과지를 아주 꼼꼼하게 잘 챙겨오셨군요.\n\n제출하신 의무기록과 기관지 확장제 반응 검사 결과를 면밀히 판독했습니다.\n\n국방부령 [별표 3] 내과 137호(기관지 천식) 기준에 부합하여 [내과 4급(보충역)] 소견으로 병역판정관실에 상신하겠습니다.",
            text_en: "Yes! You brought thorough 6-month treatment records and pulmonary function test (PFT) results.\n\nBased on your bronchial responsiveness records and Defense Ministry standards [Table 3] Item 137 (Asthma), I am referring you with an Internal Medicine Grade 4 recommendation."
          }
        ]
      },
      orthopedic: {
        speaker: "정형외과 전담의사 NPC",
        speaker_en: "Orthopedic Specialist Doctor NPC",
        dialogues: [
          {
            speaker: "정형외과 전담의사 NPC",
            speaker_en: "Orthopedic Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "{name} 님 어서 오세요. 이곳은 [정형외과 전문의 정밀 진료실]입니다.\n\n각 진료과목별 전문의 의사가 1:1로 배치되어, 수검자가 제출한 병무용 진단서와 의무기록을 면밀히 검토하고 정밀 신체 검진을 진행하는 곳입니다.",
            text_en: "Welcome, {name}. This is the [Orthopedic Specialist Clinic].\n\nSpecialist doctors review your medical certificates and clinical records and conduct precision physical examinations."
          },
          {
            speaker: "{name} (주인공)",
            speaker_en: "{name} (Protagonist)",
            char: "assets/minwoo_nervous.png",
            charPos: "right",
            plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
            text: "선생님, 제가 예전에 무릎 십자인대 수술을 받았는데, 사전에 챙겨온 병무용 진단서와 수술기록지, MRI 영상 CD를 여기 제출하면 될까요?",
            text_en: "Doctor, I had cruciate ligament knee surgery in the past. Should I submit the military medical certificate, surgical records, and MRI CD I brought from the locker room?"
          },
          {
            speaker: "정형외과 전담의사 NPC",
            speaker_en: "Orthopedic Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "네! 서류를 아주 꼼꼼하게 잘 챙겨오셨군요.\n\n제출하신 수술기록지와 최근 MRI 영상을 면밀히 판독하고, 관절 동요도 정밀 측정을 진행했습니다.\n\n국방부령 [별표 3] 204호 기준에 부합하여 [정형외과 4급(보충역)] 소견으로 병역판정관실에 상신하겠습니다.",
            text_en: "Yes! You prepared your documents thoroughly.\n\nAfter reviewing your surgical records and recent MRI imaging, and measuring joint instability, you meet Defense Ministry standards [Table 3] item 204. I am referring you with a Grade 4 (Supplemental Service) recommendation."
          }
        ]
      },
      ophthalmology: {
        speaker: "안과 전담의사 NPC",
        speaker_en: "Ophthalmology Specialist Doctor NPC",
        dialogues: [
          {
            speaker: "안과 전담의사 NPC",
            speaker_en: "Ophthalmology Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "{name} 님 어서 오세요. 이곳은 [안과 전문의 정밀 진료실]입니다.\n\n수검자가 제출한 안과 의무기록과 수술기록지, 정밀 굴절 검사 및 안저 촬영 결과를 면밀히 검토하고 정밀 진료를 진행하는 곳입니다.",
            text_en: "Welcome, {name}. This is the [Ophthalmology Specialist Clinic].\n\nWe review your clinical records, refractive tests, and fundus photography results."
          },
          {
            speaker: "{name} (주인공)",
            speaker_en: "{name} (Protagonist)",
            char: "assets/minwoo_nervous.png",
            charPos: "right",
            plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
            text: "선생님, 제가 기질적 각막 또는 망막 질환 수술 이력이 있는데, 사전에 챙겨온 병무용 진단서와 안과 수술기록사본을 여기 제출하면 될까요?",
            text_en: "Doctor, I had corneal or retinal surgery in the past. Should I submit my ophthalmology medical records here?"
          },
          {
            speaker: "안과 전담의사 NPC",
            speaker_en: "Ophthalmology Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "네! 안과 정밀 진단서와 의무기록을 꼼꼼하게 잘 챙겨오셨군요.\n\n제출하신 서류와 현장 안저 정밀 검사 결과를 종합 판독했습니다.\n\n국방부령 [별표 3] 안과 285호 기준에 부합하여 [안과 4급(보충역)] 소견으로 병역판정관실에 상신하겠습니다.",
            text_en: "Yes! You brought thorough ophthalmology records.\n\nAfter comprehensive evaluation, meeting Defense Ministry standards [Table 3] Item 285, I am referring you with an Ophthalmology Grade 4 recommendation."
          }
        ]
      },
      normal: {
        speaker: "일반종합 전담의사 NPC",
        speaker_en: "General Medicine Specialist Doctor NPC",
        dialogues: [
          {
            speaker: "일반종합 전담의사 NPC",
            speaker_en: "General Medicine Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "{name} 님 어서 오세요. 이곳은 [과목별 전문의 정밀 진료실]입니다.\n\n기본검사 및 임상병리 검사 결과를 종합하여 전반적인 신체 건강 상태를 최종 확인하는 곳입니다.",
            text_en: "Welcome, {name}. This is the [Specialist Clinic].\n\nWe verify your overall health results from basic biometrics and clinical pathology."
          },
          {
            speaker: "{name} (주인공)",
            speaker_en: "{name} (Protagonist)",
            char: "assets/minwoo.png",
            charPos: "right",
            plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
            text: "선생님, 저는 평소 특이질환이나 수술 이력 없이 건강한 편인데, 오늘 검사 결과에 특이사항이 있을까요?",
            text_en: "Doctor, I don't have any specific medical history. Are my exam results all normal?"
          },
          {
            speaker: "일반종합 전담의사 NPC",
            speaker_en: "General Medicine Specialist Doctor NPC",
            char: "assets/doctor_serious.png",
            charPos: "right",
            plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
            text: "네! 앞서 진행한 심리검사, 혈액·소변검사, 흉부 X-ray, 신장·체중(BMI), 혈압 모두 완벽하게 정상입니다.\n\n국방부령 [별표 1, 2] 기준에 부합하여 [신체등급 1급(현역)] 소견으로 적성분류실에 안내해 드리겠습니다.",
            text_en: "Yes! All test results including biometrics, blood/urine, chest X-ray, and blood pressure are completely normal. Meeting standards, referring you with Grade 1 (Active Duty) to Aptitude Classification."
          }
        ]
      }
    },
    dialogues: [],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "DOCTOR_ROOM_CONFIRM"
  },

  // [SCENE 11] 적성분류 (군 특기 및 병과 적성분류) - 전공 맞춤 모집병 API 실시간 연계 (적성분류관, 민우, 힘찬이)
  {
    bg: "assets/aptitude_room.jpg",
    char: "assets/aptitude_officer.png",
    speaker: "적성분류관 NPC",
    speaker_en: "Aptitude Classification Officer NPC",
    plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
    dialogues: [
      {
        speaker: "적성분류관 NPC",
        speaker_en: "Aptitude Classification Officer NPC",
        char: "assets/aptitude_officer.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
        text: "{name} 수검자님 반갑습니다! 이곳은 전공, 자격증, 적성을 종합하여 본인에게 가장 적합한 군 특기 및 병과를 분류하는 [적성분류실]입니다.\n\n전산 기록을 보니 대학교에서 컴퓨터소프트웨어공학을 전공 중이시네요! 전공 역량을 살려 복무할 수 있는 맞춤 특기 분야를 추천해 드리겠습니다.",
        text_en: "Welcome examinee {name}! This is the [Aptitude Classification Room], where we analyze your major, licenses, and aptitudes to recommend the best military specialties.\n\nLooking at your records, you are majoring in Computer Software Engineering! Let me recommend tailored specialties that match your tech skills."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "제 전공뿐만 아니라 다른 희망 분야의 추천 특기와 모집 접수 일정, 실시간 경쟁률도 꼼꼼히 확인해 보고 싶어요!",
        text_en: "I'd like to check recommended specialties, recruitment application dates, and live competition rates across different fields!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "병무청 [모집병 지원가능 정보 & 실시간 접수현황 API] 연동 완료!\n\nIT/SW 분야뿐만 아니라 기계·전자, 어학·행정, 경영·운전, 의료·보건 등 원하시는 분야를 자유롭게 선택하여 정확한 모집 접수 일정과 병무청 공식 상세 공고를 확인해 보세요!",
        text_en: "MMA Live Recruit Specialty & Application API connected!\n\nSelect your field—IT/SW, Mechanical/Electronics, Languages/Admin, Business/Driving, or Healthcare—to view exact recruitment dates and official notices!"
      }
    ],
    apiSource: "[API] 공공데이터포털: 병무청_모집분야별 지원자격 및 실시간 군지원 접수현황 Open API",
    apiSource_en: "[API] Public Data Portal: MMA Recruit Specialty Eligibility & Live Competition Rate Open API",
    apiSourceUrl: "https://www.data.go.kr/data/3064321/openapi.do",
    apiIcon: "database",
    isApi: true,
    widgetType: "APTITUDE_CONFIRM"
  },

  // [SCENE 12] 판정실 - 판정보좌관 확인 ➔ 수석판정관 최종 판정 & 여비 정산 & 나라사랑가게 안내
  {
    bg: "assets/adjudicator_room.jpg",
    char: "assets/adjudicator.png",
    speaker: "수석판정관 NPC",
    speaker_en: "Chief Adjudicator NPC",
    plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
    dialogues: [
      {
        speaker: "판정보좌관 NPC",
        speaker_en: "Adjudication Assistant NPC",
        char: "assets/assistant_adjudicator.png",
        charPos: "right",
        plateClass: "from-slate-700 to-blue-900 border-slate-400/40",
        text: "안녕하십니까! 판정보좌관입니다. {name} 님의 심리검사, 임상병리, 체질량(BMI), 전문의 정밀진료 및 적성분류 전산 데이터를 모두 대조·검증 완료하여 수석판정관님께 최종 판정을 상신합니다.",
        text_en: "Hello, I am the Adjudication Assistant. All medical and aptitude data have been verified. Submitting to Chief Adjudicator for final determination."
      },
      {
        speaker: "수석판정관 NPC",
        speaker_en: "Chief Adjudicator NPC",
        char: "assets/adjudicator.png",
        charPos: "right",
        plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
        text: "수검자 {name} 님 수고 많으셨습니다! 종합 판정 결과 신체등급 [ {finalGrade} ] 판정 및 [ {disposition} ] 처분으로 최종 확정합니다.",
        text_en: "Examinee {name}, great job! Your final physical grade is confirmed as [ {finalGrade} ] with [ {disposition} ] disposition."
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "축하드립니다! 주소지 기준 실거리({distanceKm})를 반영한 지급여비가 등록하신 {cardType} 계좌로 입금될 예정입니다!\n스마트 e-병무지갑을 확인하시고, 검사장 근처 나라사랑가게 할인 맛집과 편의시설도 함께 안내해 드릴 테니 귀가길에 참고해 보세요!",
        text_en: "Congratulations! Travel allowance based on actual distance ({distanceKm}) is scheduled to be deposited into your {cardType} account!\nCheck out your e-Military Wallet benefits. We've also provided nearby Nara Sarang partner restaurants and amenities for your reference on your way home!"
      }
    ],
    apiSource: "[API] 공공데이터포털: 병무청_나라사랑가게 가맹점 & 법제처: 「병역의무자 여비지급 규정」 Open API",
    apiSource_en: "[API] Public Data Portal: MMA Nara Sarang Store & Law Center: Military Service Travel Allowance Regulations Open API",
    apiSourceUrl: "https://www.data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "FINAL_SUMMARY_CARDS"
  },

  // [SCENE 13] 탈의실 및 사물함실 - 환복 및 소지품 회수 (힘찬이 & 민우)
  {
    bg: "assets/locker_room.jpg",
    char: "assets/himchan_smile.png",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    dialogues: [
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_smile.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "{name} 님, 검사복을 벗고 사물함에서 본인 옷으로 편안하게 환복해 주세요.\n\n사물함에 보관했던 스마트폰, 지갑, 챙겨온 서류 등 소지품을 빠짐없이 챙기시고 전자키를 반납함에 넣으시면 검사장의 모든 일정이 끝납니다!",
        text_en: "{name}, please change from your exam uniform back into your normal clothes.\n\nMake sure to take all belongings from your locker and return your key to finish the exam center schedule!"
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "사물함에서 옷 갈아입고 핸드폰이랑 지갑도 다 챙겼어! 이제 집으로 출발해 볼까?",
        text_en: "Changed clothes and packed my phone and wallet from the locker! Time to head home!"
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "LOCKER_RETURN_CONFIRM"
  },

  // [SCENE 14] 집 도착 & 에필로그 - 제1화 완결 (환하게 웃는 민우 & 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_happy.png",
    speaker: "{name} (주인공)",
    speaker_en: "{name} (Protagonist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    dialogues: [
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "후아~ 드디어 집에 도착했다! 오늘 하루 병역판정검사 풀코스를 무사히 마치고 나니 마음이 정말 홀가분하고 뿌듯하네.\n\n스마트폰에 [나라사랑카드 지급여비 입금 완료] 문자 알림도 딱 와 있고, 아까 안내받은 스마트 e-병무지갑 앱을 설치했더니 결과서도 스마트폰으로 바로 편하게 조회할 수 있어서 정말 좋은걸!",
        text_en: "Phew~ Finally back home! Having completed the full physical exam course, I feel relieved and proud.\n\nI just got the SMS notification for my travel allowance deposit, and having installed the e-Military Wallet app, being able to check my digital exam certificate directly on my phone is so convenient!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "{name} 님, 오늘 하루 정말 수고 많으셨습니다!\n\n첫 병역판정검사부터 군 특기 설계, 그리고 앞으로의 병역 이행까지 대한민국 청춘의 모든 여정에 병무청이 항상 든든하게 함께하겠습니다!",
        text_en: "{name}, wonderful job today!\n\nFrom your first exam to career planning and future service, MMA will always stand firmly by your side!"
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "처음엔 병역판정검사라 해서 막연하고 긴장도 많이 됐는데, 미리 일정과 서류도 잘 챙기고 차근차근 검사를 직접 마치고 나니 정말 뿌듯하다! 대한민국 청년으로서 당당하게 국방의 의무를 마주할 자신감이 생겼어!",
        text_en: "At first, I was so nervous about my draft physical exam, but having prepared my schedule and documents thoroughly and completed the entire process today, I feel truly proud! As a young Korean, I now have full confidence to face my military duty proudly!"
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "EPISODE_COMPLETE"
  }
];
