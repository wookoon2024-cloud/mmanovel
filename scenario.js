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

  // [SCENE 1] 민우의 자취방 - 힘찬이 첫 등장 & 일정 변경 제안 (반갑게 웃으며 인사)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "충성! 안녕하십니까 {name} 님, 병무청 AI 가이드 '힘찬이'입니다!\n\n많은 청년들이 잘 모르시는데, 병역판정검사는 공석만 있다면\n통지된 날짜와 상관없이 희망일 전날까지 원하는 날짜로 100% 자유롭게 변경할 수 있습니다.\n\n{name} 님 지역 관할 병무청의 [월별 실시간 잔여석 달력]을 확인해 보시겠습니까?",
    text_en: "Salute! Hello {name}, I'm 'Himchan', your Military Manpower Administration AI guide!\n\nMany young citizens don't know this, but as long as there are vacancies, you can freely change your draft physical exam date 100% online up to 1 day before your desired date regardless of the notice.\n\nWould you like to check the [Monthly Real-time Vacancy Calendar] for your regional MMA office?",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "CHOICE_SCHEDULE_CONSENT"
  },

  // [SCENE 2] 민우의 자취방 - 지역 및 달력 선택 (안내하는 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "예를 들어 {name} 님의 주민등록 주소지가 [{residentAddress}]인 경우,\n해당 관할 지방병무청({region})의 실시간 공석 달력과 희망 일정을 바로 선택할 수 있습니다!\n\n또한 주소지 기준 실거리({distanceKm})에 맞춰 당일 지급될 왕복 여비({fare})가 실시간으로 자동 산출됩니다.",
    text_en: "For example, if your resident registration address is [{residentAddress}],\nyou can immediately select the real-time vacancy calendar and preferred date for your regional office ({region})!\n\nAlso, your round-trip travel allowance ({fare}) will be automatically calculated live based on actual distance ({distanceKm}).",
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
    text: "탁월한 선택입니다! [ {examDate} ] 잔여석 확인 및 주소지({residentAddress}) 기준 실거리({distanceKm})를 반영한 지급여비 [ {fare} ] 산정이 완료되었습니다!\n\n실제 일정 변경 민원이 필요하신 경우, 병무청 민원포털에 접속하여 간편하게 변경 신청하실 수 있습니다.",
    text_en: "Excellent choice! Vacancies confirmed for [ {examDate} ]. Estimated travel allowance is [ {fare} ] based on distance ({distanceKm}) from your address ({residentAddress})!\n\nIf you need to change your official schedule, you can easily apply through the MMA Civil Petition Portal.",
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

  // [SCENE 5] 병무청 로비 - 가상 검사장 도착 & 나라사랑카드 등록 (씩씩한 힘찬이)
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "드디어 가상 {region} 로비 접수데스크에 도착했습니다!\n\n가장 먼저 본인 확인 후 [나라사랑카드]를 발급·등록해야 하는데요, 이 카드가 왜 검사의 시작이자 필수인지 아시나요?\n\n① 검사장 전자신분증: 환복 후 이 카드를 주머니에 넣고 다니며, 모든 검사실(심리, 임상병리, 신체계측, 의사 진료) 입구 리더기에 '삑-' 태그하여 본인을 인증하고 검사 결과를 실시간 전산 기록합니다.\n\n② 지급여비 수령: 오늘 검사가 끝나면 왕복 교통비와 식비 등 지급여비가 등록하신 이 계좌로 입금될 예정입니다.\n\n③ 군 복무 & 예비군 복지: 복무 중 군 급여 수령, PX 최대 20% 할인, 그리고 전역 후 예비군 훈련 여비 지급까지 군 생활 전 기간 동안 핵심 혜택 카드로 쭉 사용하게 됩니다!\n\n두 은행의 혜택을 비교해 보시고 마음에 드는 나라사랑카드를 선택해 보세요.",
    text_en: "We've arrived at the virtual {region} reception lobby!\n\nFirst, you will register your [Nara Sarang Card]. Why is this card essential?\n\n① Exam Electronic ID: You will carry this card in your pocket and tap it at readers before entering every exam room (psychology, pathology, biometrics, doctor clinic) to record results in real-time.\n\n② Travel Allowance: Transit and meal allowances are scheduled to be deposited into this designated account.\n\n③ Military & Reserve Welfare: Used continuously for military salary, up to 20% PX discounts, and future Reserve Force training allowances!\n\nCompare the benefits and select your preferred Nara Sarang Card.",
    apiSource: "[공식출처] 나라사랑포털(군인공제회C&C) & KB국민·IBK기업 공식 금융 혜택 공시 데이터",
    apiSource_en: "[Official Source] Nara Sarang Portal & Official Bank Benefits Disclosure Data",
    apiSourceUrl: "https://www.narasarang.or.kr",
    apiIcon: "globe",
    isApi: true,
    widgetType: "NARA_CARD_CHOICE"
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
        text: "탈의실 및 사물함실로 이동했습니다!\n\n휴대폰, 지갑, 시계 등 모든 개인 소지품은 배정된 사물함에 넣고 편안한 전용 검사복으로 환복해 주세요.",
        text_en: "We've moved to the locker room!\n\nPlease store all personal belongings in your locker and change into the examination uniform."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "소지품은 사물함에 넣고... 아! 아까 발급받은 나라사랑카드랑 챙겨온 병원 진단서 서류는 검사복 주머니에 꼭 챙겨야지!",
        text_en: "Belongings in locker... Oh! I must keep my Nara Sarang Card and medical documents in my pocket!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "정확합니다 {name} 님! 카드와 서류를 주머니에 챙기셨다면 첫 번째 검사인 [심리검사장]으로 출발해 볼까요?",
        text_en: "Exactly right! With your card and documents ready, let's head to the [Psychological Testing Hall]!"
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "LOCKER_CHANGE_CONFIRM"
  },

  // [SCENE 7] 심리검사장 - PC 1:1 인지능력 및 인성검사 (심리검사관 & 민우)
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
        text: "안녕하십니까 수검자 여러분! 병역판정검사의 첫 관문인 심리검사장입니다.\n\n배정받은 좌석 모니터 화면에 본인의 성명과 주민등록번호를 입력하여 로그인해 주세요.",
        text_en: "Welcome examinees! This is the Psychological Testing Hall.\n\nPlease log in by entering your name and Resident Registration Number on your monitor screen."
      },
      {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "키보드로 이름이랑 주민등록번호를 입력해서 로그인하면 되는구나!\n인지능력검사와 인성검사 화면이 떴네.",
        text_en: "I log in by typing my name and ID number on the keyboard!\nCognitive and Personality test screens appeared."
      },
      {
        speaker: "심리검사관 NPC",
        speaker_en: "Psychological Examiner NPC",
        char: "assets/psychologist.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
        text: "차분하고 솔직하게 문항을 풀어주세요. 그럼 컴퓨터 화면에 출제되는 대표 문항을 직접 풀어보실까요?",
        text_en: "Please answer calmly and honestly. Let's solve sample questions on the computer screen!"
      }
    ],
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "PSYCH_TEST_UI"
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
        text: "여기서부터 나라사랑카드를 태그하는 거구나! 삑- 소변검사용 종이컵과 스틱을 받았어. 화장실로 가보자.",
        text_en: "This is where I tap my Nara Sarang Card! Beep- received urine cup and stick. Let's head to the restroom."
      }
    ],
    // [인터랙션 단계별 세부 대사 - 통합 일원화]
    stepDialogues: {
      step2: {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        char: "assets/minwoo.png",
        text: "화장실에 도착했어. 설명대로 처음 나오는 1~2초간의 소변은 변기에 살짝 버리고, 깨끗한 '중간 소변'을 컵의 1/3 정도 받아서 검체 보관함에 제출하자!",
        text_en: "Arrived at the restroom. I discard the first 1-2 seconds of urine, collect the midstream urine in 1/3 of the cup, and submit it into the specimen box!"
      },
      step3: {
        speaker: "임상병리사 NPC",
        speaker_en: "Clinical Pathologist NPC",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        char: "assets/lab_officer.png",
        text: "소변 검체 확인했습니다! 이어서 혈액 검사를 위해 채혈을 진행합니다.\n\n⚠️ 채혈 부위는 멍이 들지 않도록 문지르지 마시고 5분간 꾹 눌러서 지혈해 주세요!",
        text_en: "Urine sample confirmed! Now collecting blood sample.\n\n⚠️ Press firmly with alcohol cotton for 5 minutes without rubbing to prevent bruising!"
      },
      step4: {
        speaker: "영상의학 방사선사 NPC",
        speaker_en: "Radiologist NPC",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        char: "assets/lab_officer.png",
        text: "흉부 X-ray 촬영대 앞에 가슴을 밀착해 주세요. 숨을 깊게 들이마시고~ 참으세요! (찰칵) 촬영이 모두 끝났습니다.\n다음 검사인 [기본검사실]로 이동합니다.",
        text_en: "Please stand firmly against the X-ray board. Deep breath in and hold it! (Click) Imaging complete.\nProceed to the Basic Examination Room."
      }
    },
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "LAB_ROOM_CONFIRM"
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
    // [인터랙션 단계별 세부 대사 - 통합 일원화]
    stepDialogues: {
      step2: {
        speaker: "{name} (주인공)",
        speaker_en: "{name} (Protagonist)",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        char: "assets/minwoo.png",
        text: "키와 몸무게 측정이 끝났네. 옆에 있는 자동 혈압계에 오른팔을 쑥 넣었어. 호흡을 편안하게 유지해야 혈압이 정확하게 측정된댔지.",
        text_en: "Height and weight measurement done. Inserted my right arm into the automatic blood pressure monitor. Keeping calm for accurate reading."
      },
      step3: {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        char: "assets/medical_officer.png",
        text: "혈압 120/80 정상입니다! 이어서 5m 전방 시력표와 색신 책자 검사를 진행했습니다. 좌 1.0 / 우 1.0 정상입니다. 이제 기본검사 계측 결과를 확인해 볼까요?",
        text_en: "Blood pressure 120/80 is normal! Measured eyesight and color vision, both eyes 1.0 normal. Let's check your biometric measurement results!"
      },
      calcDisease: {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        char: "assets/medical_officer.png",
        text: "기본검사 계측이 완료되었습니다. 사전에 등록하신 [{healthCheck}]의 정밀 심사를 위해 [전문의 진료실]로 이동해 주세요!",
        text_en: "Basic biometric exam complete. Please proceed to the Specialist Clinic for review of your medical documents."
      },
      calcNormal: {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        char: "assets/medical_officer.png",
        text: "기본검사 결과 신장·체중(BMI), 혈압, 시력 측정이 모두 완료되었습니다! 전공과 자격을 고려한 군 특기 적성 분류를 위해 [적성분류실]로 이동해 주세요!",
        text_en: "Basic biometric exam complete! Please proceed to the Aptitude Classification Room for military specialty assignment."
      }
    },
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "BMI_CALCULATOR"
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
        text: "제 전공을 살릴 수 있는 추천 모집병 특기와 실시간 지원 경쟁률은 어떻게 되나요?",
        text_en: "What specialized military roles match my major, and what are their current real-time application competition rates?"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "병무청 [모집병 지원가능 정보 & 실시간 접수현황 API] 조회 완료!\n\n[육군 IT/SW개발병(3.1:1)]과 [공군 정보체계운영병(2.4:1)] 추천 카드 및 국가기술자격 가산점 기준을 아래에 띄워드렸습니다!",
        text_en: "MMA Live Recruit Specialty & Application API query complete!\n\nWe've displayed Army IT/SW Developer (3.1:1) and Air Force Info Systems (2.4:1) cards and national technical qualification bonus point criteria below!"
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
        text: "축하드립니다! 주소지 기준 실거리({distanceKm})를 반영한 지급여비 [ {fare} ]가 등록하신 {cardType} 계좌로 입금될 예정입니다!\n아래 화면에서 스마트 e-병무지갑을 확인하시고, 검사장 근처 나라사랑가게 할인 맛집과 편의시설도 함께 안내해 드릴 테니 귀가길에 참고해 보세요!",
        text_en: "Congratulations! Travel allowance [ {fare} ] based on actual distance ({distanceKm}) is scheduled to be deposited into your {cardType} account!\nCheck out your e-Military Wallet benefits below. We've also provided nearby Nara Sarang partner restaurants and amenities for your reference on your way home!"
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
        text: "후아~ 드디어 집에 도착했다! 오늘 하루 병역판정검사 풀코스를 무사히 마치고 나니 마음이 정말 홀가분하고 뿌듯하네.\n\n스마트폰에 [나라사랑카드 여비 {fare} 입금 완료] 문자 알림도 딱 와 있고, 아까 안내받은 스마트 e-병무지갑 앱을 설치했더니 결과서도 스마트폰으로 바로 편하게 조회할 수 있어서 정말 좋은걸!",
        text_en: "Phew~ Finally back home! Having completed the full physical exam course, I feel relieved and proud.\n\nI just got the SMS notification for my travel allowance [{fare}] deposit, and having installed the e-Military Wallet app, being able to check my digital exam certificate directly on my phone is so convenient!"
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
