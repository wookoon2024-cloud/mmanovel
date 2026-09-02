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
    apiSource: "공공데이터포털: 병무청_병역판정검사 일자 및 장소 본인선택 공석 데이터",
    apiSource_en: "Public Data Portal: MMA Draft Exam Schedule Selection Vacancy Data",
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

  // [SCENE 5] 병무청 로비 - 가상 검사장 도착 & 나라사랑카드 등록
  {
    bg: "assets/lobby.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "드디어 가상 {region} 로비 접수데스크에 도착했습니다!\n\n가장 먼저 본인 확인 후 [나라사랑카드]를 발급·등록해야 하는데요, 이 카드가 왜 검사의 시작이자 필수인지 아시나요?\n\n① 검사장 전자신분증: 환복 후 이 카드를 주머니에 넣고 다니며, 모든 검사실(심리, 임상병리, 신체계측, 의사 진료) 입구 리더기에 '삑-' 태그하여 본인을 인증하고 검사 결과를 실시간 전산 기록합니다.\n\n② 실시간 여비 지급: 오늘 검사가 끝나면 왕복 교통비와 식비가 당일 이 계좌로 즉시 자동 입금됩니다.\n\n③ 군 복무 & 예비군 복지: 복무 중 군 급여 수령, PX 최대 20% 할인, 그리고 전역 후 예비군 훈련 여비 지급까지 군 생활 전 기간 동안 핵심 혜택 카드로 쭉 사용하게 됩니다!\n\n두 은행의 혜택을 비교해 보시고 마음에 드는 나라사랑카드를 선택해 보세요.",
    text_en: "We've arrived at the virtual {region} reception lobby!\n\nFirst, you will register your [Nara Sarang Card]. Why is this card essential?\n\n① Exam Electronic ID: You will carry this card in your pocket and tap it at readers before entering every exam room (psychology, pathology, biometrics, doctor clinic) to record results in real-time.\n\n② Real-time Travel Allowance: Transit and meal allowances are directly deposited into this account on the same day.\n\n③ Military & Reserve Welfare: Used continuously for military salary, up to 20% PX discounts, and future Reserve Force training allowances!\n\nCompare the benefits and select your preferred Nara Sarang Card.",
    apiSource: "나라사랑포털(군인공제회C&C) & 병무청 협약 금융기관(KB·IBK) 공식 데이터",
    apiSource_en: "Nara Sarang Portal & MMA Partner Financial Institutions Official Data",
    apiIcon: "database",
    isApi: true,
    widgetType: "NARA_CARD_CHOICE"
  },

  // [SCENE 6] 탈의실 및 사물함실 - 사물함 보관 & 검사복 환복
  {
    bg: "assets/locker_room.jpg",
    char: "assets/himchan.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "탈의실 및 사물함실로 이동했습니다!\n\n여기서 아주 중요한 주의사항이 있습니다!\n\n모든 개인 소지품(휴대폰, 지갑, 시계, 겉옷 등)은 배정된 사물함에 넣고 전용 검사복(상·하의)으로 환복하셔야 합니다.\n\n⚠️ 단, 절대 사물함에 넣으면 안 되는 2가지!\n① 방금 등록한 [나라사랑카드] (모든 검사실 전산 태그용)\n② 의사 진료 시 제출할 [필수 의료서류](병무용 진단서, 수술기록지, 영상 CD 등)\n\n이 2가지는 사물함에 넣지 말고 꼭 검사복 주머니에 챙겨서 나오셔야 합니다!\n환복을 마치셨다면 첫 번째 검사인 [심리검사장]으로 이동해 볼까요?",
    text_en: "We've moved to the locker room!\n\nImportant instructions:\nStore all personal belongings (phone, wallet, watch, coat) in your assigned locker and change into the examination uniform.\n\n⚠️ 2 items you MUST keep with you:\n① Your registered [Nara Sarang Card] (for tagging at all exam rooms)\n② Required [Medical Documents] (diagnosis, surgical notes, MRI CD for doctor)\n\nKeep these in your pockets! Once changed, let's head to the [Psychological Testing Hall]!",
    apiSource: "국가법령정보센터: 「병역법」 및 병역판정검사 수검 절차 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 & Physical Exam Procedures",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LOCKER_CHANGE_CONFIRM"
  },

  // [SCENE 7] 심리검사장 (전산실) - 1차 인지능력 및 인성검사
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "병무청 검사관 NPC",
    speaker_en: "MMA Testing Officer NPC",
    plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
    text: "안녕하십니까 수검자 여러분! 병역판정검사의 첫 관문인 심리검사장(전산실)입니다.\n\n약 100여 대의 전산 컴퓨터가 마련되어 있으며, 배정받은 좌석에 착석 후 [나라사랑카드]를 모니터 앞 리더기에 태그하여 검사를 시작합니다.\n\n심리검사는 크게 2가지로 구성됩니다:\n① 1차 인지능력검사: 언어, 수리, 공간지각 등 기초 인지능력 측정\n② 1차 인성검사: 성격 특성, 정서적 안정성 및 군 복무 적합도 종합 평가\n(추가로 본인의 신체/정신건강 상태를 체크하는 질병상태문진표도 함께 작성합니다)\n\n💡 [핵심 꿀팁]: 신검 방문 전, 병무청 누리집(mwpt.mma.go.kr)이나 모바일 e-병무지갑 앱에서 [병역판정 심리검사 사전 실시]를 미리 작성하고 오시면 현장에서 검사 시간을 크게 단축하실 수 있습니다!\n\n그럼 실제 컴퓨터 화면에 출제되는 대표 문항을 직접 풀어보실까요?",
    text_en: "Welcome examinees! This is the Psychological Testing Hall, the first official station.\n\nWith over 100 computer terminals, take your assigned seat and tap your [Nara Sarang Card] on the card reader to begin.\n\nThe test consists of:\n① 1st Cognitive Aptitude Test: basic verbal, numerical, spatial reasoning\n② 1st Personality Test: personality traits, emotional stability, and military adaptability\n(A medical condition questionnaire is also completed)\n\n💡 [Pro Tip]: You can complete the [Pre-exam Psychological Test] online beforehand on the MMA portal (mwpt.mma.go.kr) or e-MMA Wallet app to save substantial time on-site!\n\nNow, let's solve sample questions on screen.",
    apiSource: "국가법령정보센터: 「병역법」 제11조 및 병역판정 심리검사 운영 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 Art. 11 & Psychological Testing Regulations",
    apiIcon: "scale",
    isApi: true,
    widgetType: "PSYCH_TEST_UI"
  },

  // [SCENE 8] 임상병리검사실 및 영상의학실 - 소변·혈액 채취 & 흉부 X-ray
  {
    bg: "assets/lab_room.jpg",
    char: "assets/doctor.png",
    charPos: "right",
    speaker: "임상병리사 NPC",
    speaker_en: "Clinical Pathologist NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    text: "안녕하십니까! 이곳은 [임상병리검사실]입니다.\n\n간기능, 신장기능, 혈당, 단백뇨, 혈액질환 등 체내 주요 건강 상태를 정밀하게 확인하기 위해 소변검사와 채혈(혈액검사)을 진행합니다.\n\n먼저 [나라사랑카드]를 리더기에 태그한 후, 소변검사 키트를 챙겨 화장실에서 소변을 채취해 오셔야 합니다.",
    text_en: "Welcome! This is the Clinical Pathology Lab.\n\nWe perform urine and blood tests to evaluate liver/kidney functions, blood glucose, proteinuria, and blood disorders.\n\nFirst, tap your [Nara Sarang Card] on the reader, receive your urine test kit, and proceed to the restroom to collect your sample!",
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) 임상병리검사 기준",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 Clinical Pathology Standards",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LAB_ROOM_CONFIRM"
  },

  // [SCENE 9] 자동 신체계측실 - 신장/체중/혈압 & BMI 계산기
  {
    bg: "assets/body_measure_room.jpg",
    char: "assets/doctor.png",
    speaker: "의무관 NPC",
    speaker_en: "Medical Officer NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    dialogues: [
      {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        text: "김민우 님 들어오세요! 이곳은 [자동 신체계측실]입니다.\n\n최첨단 자동 계측기를 통해 신장(키), 체중(몸무게), 혈압, 시력을 전산으로 정밀 측정하여 신체등급의 핵심 기준인 체질량지수(BMI)를 판정하는 곳입니다.",
        text_en: "Minwoo Kim, please come in! This is the [Automated Biometric Measurement Room].\n\nWe measure your height, weight, blood pressure, and eyesight using automated precision instruments to calculate your Body Mass Index (BMI)."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "아, 여기서 키와 몸무게를 재는군요! 나라사랑카드를 먼저 모니터 리더기에 태그하면 되나요?",
        text_en: "Ah, this is where height and weight are measured! Do I tap my Nara Sarang Card on the monitor reader first?"
      },
      {
        speaker: "의무관 NPC",
        speaker_en: "Medical Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        text: "네 맞습니다! 카드를 태그하시고, 측정 발판 위에 정자세로 바르게 올라서 주세요.\n\n발뒤꿈치를 밀착하고 턱을 가볍게 당겨주시면 자동으로 측정이 진행됩니다. 민우 님의 신장과 체중을 입력해 실시간 BMI 판정을 확인해 볼까요?",
        text_en: "That's correct! Tap your card and step onto the platform in an upright posture.\n\nKeep your heels together and tuck your chin slightly for accurate measurement. Let's check your real-time BMI evaluation!"
      }
    ],
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) [별표 1] 신장·체중 판정기준",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 [Table 1] Height & Weight Standards",
    apiIcon: "scale",
    isApi: true,
    widgetType: "BMI_CALCULATOR"
  },

  // [SCENE 10] 전문의 정밀 진료실 - 정형외과 세부 진료 (질환/서류 지참자 분기)
  {
    bg: "assets/doctor_room.jpg",
    char: "assets/doctor.png",
    speaker: "정형외과 전담의사 NPC",
    speaker_en: "Orthopedic Specialist Doctor NPC",
    plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
    dialogues: [
      {
        speaker: "정형외과 전담의사 NPC",
        speaker_en: "Orthopedic Specialist Doctor NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
        text: "김민우 님 어서 오세요. 이곳은 [과목별 전문의 정밀 진료실]입니다.\n\n각 진료과목별 전문의 의사가 1:1로 배치되어, 수검자가 제출한 병무용 진단서와 의무기록을 면밀히 검토하고 정밀 신체 검진을 진행하는 곳입니다.",
        text_en: "Welcome, Minwoo Kim. This is the [Specialist Doctor Examination Clinic].\n\nSpecialist doctors in each field review your medical certificates and clinical records and conduct precision physical examinations."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "선생님, 제가 예전에 무릎 십자인대 수술을 받았는데, 탈의실에서 챙겨온 병무용 진단서와 수술기록지, MRI 영상 CD를 여기 제출하면 될까요?",
        text_en: "Doctor, I had cruciate ligament knee surgery in the past. Should I submit the military medical certificate, surgical records, and MRI CD I brought from the locker room?"
      },
      {
        speaker: "정형외과 전담의사 NPC",
        speaker_en: "Orthopedic Specialist Doctor NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
        text: "네! 서류를 아주 꼼꼼하게 잘 챙겨오셨군요.\n\n제출하신 수술기록지와 최근 MRI 영상을 면밀히 판독하고, 관절 동요도 정밀 측정을 진행했습니다.\n\n국방부령 [별표 2] 204호 기준에 부합하여 [정형외과 4급(보충역)] 소견으로 병역판정관실에 상신하겠습니다.",
        text_en: "Yes! You prepared your documents thoroughly.\n\nAfter reviewing your surgical records and recent MRI imaging, and measuring joint instability, you meet Defense Ministry standards [Table 2] item 204. I am referring you with a Grade 4 (Supplemental Service) recommendation."
      }
    ],
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) 제11조 및 [별표 2] 204호",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」(Defense Ministry Ordinance) Art. 11 & Table 2",
    apiIcon: "scale",
    isApi: true,
    widgetType: "DOCTOR_ROOM_CONFIRM"
  },

  // [SCENE 11] 적성분류실 (병역진로설계 & 군 특기 분류) - 정상 1~2급 수검자 분기
  {
    bg: "assets/career_center.jpg",
    char: "assets/himchan.png",
    speaker: "병역진로상담관 NPC",
    speaker_en: "Military Career Counselor NPC",
    plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
    dialogues: [
      {
        speaker: "병역진로상담관 NPC",
        speaker_en: "Military Career Counselor NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
        text: "김민우 님 반갑습니다! 이곳은 [적성분류실 및 병역진로설계센터]입니다.\n\n기본 신체검사에서 1~2급 현역 판정을 받은 수검자분들의 전공, 보유 자격증, 적성검사 결과를 종합하여 가장 적합한 [군 특기(병과)]를 1:1로 맞춤 추천하고 분류해 드리는 곳입니다.",
        text_en: "Welcome Minwoo Kim! This is the [Aptitude Classification & Military Career Center].\n\nFor examinees classified as Grade 1-2 Active Duty, we match and recommend military specialties based on your major, licenses, and aptitude test results."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "제가 대학교에서 컴퓨터/소프트웨어를 전공하고 있는데, 제 전공을 살릴 수 있는 군 특기로 복무할 수 있나요?",
        text_en: "I am majoring in Computer Science / Software in college. Can I serve in a military specialty related to my major?"
      },
      {
        speaker: "병역진로상담관 NPC",
        speaker_en: "Military Career Counselor NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
        text: "물론입니다! 전공과 자격증 연계를 통해 [육군 정보통신/SW개발병] 또는 [공군 정보체계운영병] 특기로 적극 지원하실 수 있도록 적성을 부여했습니다.\n\n이제 최종 판정서 수령과 여비 정산을 위해 판정보조관 및 수석판정관실로 이동하겠습니다!",
        text_en: "Certainly! We have classified your military aptitude for Army IT/SW Developer or Air Force Information Systems Specialist.\n\nNow, let's proceed to the Chief Adjudicator office for your final result and travel allowance settlement!"
      }
    ],
    apiSource: "공공데이터포털: 병무청_병역진로설계 맞춤 군특기 추천 데이터",
    apiSource_en: "Public Data Portal: MMA Military Career Design Recommended Specialties Data",
    apiIcon: "database",
    isApi: true,
    widgetType: "APTITUDE_CONFIRM"
  },

  // [SCENE 12] 수석판정관실 - 판정보조관 확인 ➔ 수석판정관 최종 판정 & 여비 정산
  {
    bg: "assets/adjudicator_room.jpg",
    char: "assets/himchan.png",
    speaker: "수석판정관 NPC",
    speaker_en: "Chief Adjudicator NPC",
    plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
    dialogues: [
      {
        speaker: "판정보조관 NPC",
        speaker_en: "Adjudication Assistant NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-slate-700 to-blue-900 border-slate-400/40",
        text: "안녕하십니까! 판정보조관입니다. 김민우 님의 심리검사, 임상병리검사, 자동 신체계측(BMI), 전문의 정밀 진료 및 적성분류 전산 데이터를 모두 대조·검증 완료했습니다.\n\n수석판정관님께 최종 판정을 상신합니다.",
        text_en: "Hello, I am the Adjudication Assistant. I have verified all data from your psychological test, lab tests, biometrics, specialist doctor evaluations, and aptitude classifications.\n\nSubmitting to Chief Adjudicator for final determination."
      },
      {
        speaker: "수석판정관 NPC",
        speaker_en: "Chief Adjudicator NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
        text: "수검자 김민우 님! 오늘 오전 8시부터 시작하여 심리검사, 임상병리, 신체계측, 전문의 진료까지 총 3시간 30분 동안 진행된 모든 검사를 무사히 마치셨습니다. 대단히 수고 많으셨습니다!\n\n종합 판정 결과 신체등급 [ {finalGrade} ] 판정 및 [ {disposition} ] 처분으로 최종 확정합니다.",
        text_en: "Examinee Minwoo Kim! You have completed all exams spanning 3.5 hours since 8 AM today. Great job!\n\nYour final physical grade is [ {finalGrade} ] with [ {disposition} ] disposition."
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "민우 님 고생 많으셨습니다! 오늘 수검에 따른 실시간 여비 [ {fare} ]도 {cardType} 계좌로 즉시 입금 완료되었습니다.\n\n최종 결과서를 확인하신 후, 탈의실로 이동하여 평상복으로 갈아입고 귀가하시면 됩니다!",
        text_en: "Minwoo, wonderful job! Your travel allowance of [ {fare} ] has been deposited into your {cardType} account.\n\nAfter checking your final certificate, please proceed to the locker room to change into your normal clothes and head home!"
      }
    ],
    apiSource: "공공데이터포털: 병무청_병역의무자 여비 지급 기준 데이터 (실시간 산정)",
    apiSource_en: "Public Data Portal: MMA Travel Allowance Standards (Real-time Calculation)",
    apiIcon: "database",
    isApi: true,
    widgetType: "FINAL_SUMMARY_CARDS"
  },

  // [SCENE 13] 탈의실 및 사물함실 - 환복 & 귀가 (제1화 완결)
  {
    bg: "assets/locker_room.jpg",
    char: "assets/himchan.png",
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
        text: "민우 님, 탈의실 사물함에서 검사복을 벗고 본인 옷으로 편안하게 환복해 주세요.\n\n사물함에 보관했던 지갑, 스마트폰, 챙겨온 서류 등 소지품을 빠짐없이 챙기시고, 사물함 전자키를 반납함에 넣으시면 오늘의 모든 검사가 완벽하게 종료됩니다!",
        text_en: "Minwoo, please change from your exam uniform back into your normal clothes at the locker room.\n\nMake sure to take all belongings including your wallet, phone, and documents from your locker, and return your locker key to complete the day!"
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "약 3~4시간 동안 가상 검사장 시뮬레이션을 직접 겪어보니, 실제 신검 당일에도 전혀 긴장하지 않고 완벽하게 검사를 마칠 수 있을 것 같아요! 정말 감사합니다!",
        text_en: "Experiencing the 3-4 hour virtual exam center simulation makes me confident I won't be nervous on my real exam day. Thank you so much!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "대한민국 청춘 민우 님의 당당한 병역 이행의 첫걸음을 진심으로 응원합니다!\n\n앞으로의 군 복무와 예비군 여정도 항상 병무청이 든든하게 함께하겠습니다. 조심히 귀가하세요!",
        text_en: "We sincerely support the first step of your military service journey!\n\nMMA will always be with you throughout your service and reserve training. Have a safe trip home!"
      }
    ],
    apiSource: "병무청 공식: 병역판정검사 종합 안내 포털 (mma.go.kr)",
    apiSource_en: "MMA Official: Draft Physical Examination Comprehensive Portal (mma.go.kr)",
    apiIcon: "check-circle",
    isApi: true,
    widgetType: "EPISODE_COMPLETE"
  }
];
