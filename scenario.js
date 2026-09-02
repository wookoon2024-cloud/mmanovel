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

  // [SCENE 1] 민우의 자취방 - 힘찬이 첫 등장 & 일정 변경 제안 (반갑게 웃으며 인사)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
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

  // [SCENE 2] 민우의 자취방 - 지역 및 달력 선택 (안내하는 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
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

  // [SCENE 3] 민우의 자취방 - 예약 확정 및 직통 연락처 (신나게 응원하는 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_cheer.png",
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

  // [SCENE 4] 민우의 자취방 - 맞춤형 서류 점검 (친절한 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/himchan_smile.png",
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

  // [SCENE 5] 병무청 로비 - 가상 검사장 도착 & 나라사랑카드 등록 (씩씩한 힘찬이)
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
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
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
        text: "정확합니다 민우 님! 카드와 서류를 주머니에 챙기셨다면 첫 번째 검사인 [심리검사장]으로 출발해 볼까요?",
        text_en: "Exactly right! With your card and documents ready, let's head to the [Psychological Testing Hall]!"
      }
    ],
    apiSource: "국가법령정보센터: 「병역법」 및 병역판정검사 수검 절차 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 & Physical Exam Procedures",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LOCKER_CHANGE_CONFIRM"
  },

  // [SCENE 7] 심리검사장 - 인지능력 및 인성검사 (병무청 검사관)
  {
    bg: "assets/exam_room.jpg",
    char: "assets/doctor.png",
    speaker: "병무청 검사관 NPC",
    speaker_en: "MMA Testing Officer NPC",
    plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
    dialogues: [
      {
        speaker: "병무청 검사관 NPC",
        speaker_en: "MMA Testing Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
        text: "안녕하십니까 수검자 여러분! 병역판정검사의 첫 관문인 심리검사장입니다.\n\n배정받은 좌석 모니터 화면에 본인의 성명과 주민등록번호를 입력하여 로그인해 주세요.",
        text_en: "Welcome examinees! This is the Psychological Testing Hall.\n\nPlease log in by entering your name and Resident Registration Number on your monitor screen."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "키보드로 이름이랑 주민등록번호를 입력해서 로그인하면 되는구나!\n인지능력검사와 인성검사 화면이 떴네.",
        text_en: "I log in by typing my name and ID number on the keyboard!\nCognitive and Personality test screens appeared."
      },
      {
        speaker: "병무청 검사관 NPC",
        speaker_en: "MMA Testing Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-purple-800 border-indigo-400/40",
        text: "차분하고 솔직하게 문항을 풀어주세요. 그럼 실제 컴퓨터 화면에 출제되는 대표 문항을 직접 풀어보실까요?",
        text_en: "Please answer calmly and honestly. Let's solve sample questions on screen!"
      }
    ],
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
    speaker: "임상병리사 NPC",
    speaker_en: "Clinical Pathologist NPC",
    plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
    dialogues: [
      {
        speaker: "임상병리사 NPC",
        speaker_en: "Clinical Pathologist NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-teal-700 to-emerald-800 border-teal-400/40",
        text: "안녕하십니까! 이곳은 [임상병리검사실]입니다.\n\n간기능, 신장기능, 혈당, 단백뇨 등 체내 건강 상태를 정밀하게 확인하기 위해 소변검사와 채혈(혈액검사)을 진행합니다.\n\n검사실 앞 리더기에 [나라사랑카드]를 태그해 주세요.",
        text_en: "Welcome! This is the Clinical Pathology Lab.\n\nWe perform urine and blood tests. Please tap your [Nara Sarang Card] on the reader."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "여기서부터 나라사랑카드를 태그하는 거구나! 삑- 소변검사용 종이컵과 스틱을 받았어. 화장실로 가보자.",
        text_en: "This is where I tap my Nara Sarang Card! Beep- received urine cup and stick. Let's head to the restroom."
      }
    ],
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) 임상병리검사 기준",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 Clinical Pathology Standards",
    apiIcon: "scale",
    isApi: true,
    widgetType: "LAB_ROOM_CONFIRM"
  },

  // [SCENE 9] 기본검사실 - 신장/체중/혈압/시력 3단계 측정 & BMI 판정
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
        text: "김민우 님 들어오세요! 이곳은 [기본검사실]입니다.\n\n신장(키), 체중(몸무게), 혈압, 시력 등 기초 건강 상태를 정밀 계측하여 체질량지수(BMI)를 판정하는 곳입니다.",
        text_en: "Minwoo Kim, please come in! This is the [Basic Examination Room].\n\nWe measure your height, weight, blood pressure, and eyesight to evaluate your Body Mass Index (BMI)."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "신체계측 발판 위에 올라서서 정자세로 바르게 서면 되는 거군요! 키와 몸무게를 정확히 재어보자.",
        text_en: "I just step onto the biometric platform and stand straight! Let's measure my height and weight accurately."
      }
    ],
    apiSource: "국가법령정보센터: 「병역판정 신체검사 등 검사규칙」(국방부령) [별표 1] 신장·체중 판정기준",
    apiSource_en: "National Law Information Center: 「Physical Exam Rules」 [Table 1] Height & Weight Standards",
    apiIcon: "scale",
    isApi: true,
    widgetType: "BMI_CALCULATOR"
  },

  // [SCENE 10] 전문의 정밀 진료실 - 정형외과 세부 진료 (진지한 전문의 & 긴장한 민우)
  {
    bg: "assets/doctor_room.jpg",
    char: "assets/doctor_serious.png",
    speaker: "정형외과 전담의사 NPC",
    speaker_en: "Orthopedic Specialist Doctor NPC",
    plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
    dialogues: [
      {
        speaker: "정형외과 전담의사 NPC",
        speaker_en: "Orthopedic Specialist Doctor NPC",
        char: "assets/doctor_serious.png",
        charPos: "right",
        plateClass: "from-blue-800 to-indigo-900 border-blue-400/40",
        text: "김민우 님 어서 오세요. 이곳은 [과목별 전문의 정밀 진료실]입니다.\n\n각 진료과목별 전문의 의사가 1:1로 배치되어, 수검자가 제출한 병무용 진단서와 의무기록을 면밀히 검토하고 정밀 신체 검진을 진행하는 곳입니다.",
        text_en: "Welcome, Minwoo Kim. This is the [Specialist Doctor Examination Clinic].\n\nSpecialist doctors in each field review your medical certificates and clinical records and conduct precision physical examinations."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo_nervous.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "선생님, 제가 예전에 무릎 십자인대 수술을 받았는데, 탈의실에서 챙겨온 병무용 진단서와 수술기록지, MRI 영상 CD를 여기 제출하면 될까요?",
        text_en: "Doctor, I had cruciate ligament knee surgery in the past. Should I submit the military medical certificate, surgical records, and MRI CD I brought from the locker room?"
      },
      {
        speaker: "정형외과 전담의사 NPC",
        speaker_en: "Orthopedic Specialist Doctor NPC",
        char: "assets/doctor_serious.png",
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

  // [SCENE 11] 적성분류실 (군 특기 및 병과 적성 분류) - 정상 1~2급 수검자 분기
  {
    bg: "assets/aptitude_room.jpg",
    char: "assets/doctor.png",
    speaker: "적성분류관 NPC",
    speaker_en: "Aptitude Classification Officer NPC",
    plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
    dialogues: [
      {
        speaker: "적성분류관 NPC",
        speaker_en: "Aptitude Classification Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
        text: "김민우 님 반갑습니다! 이곳은 [적성분류실]입니다.\n\n수검자의 전공, 보유 자격·면허, 심리검사 결과를 종합하여 군 복무 시 가장 적합한 [군 특기(병과)]를 1:1로 맞춤 분류하고 전산에 부여해 드리는 곳입니다.",
        text_en: "Welcome Minwoo Kim! This is the [Aptitude Classification Section].\n\nWe classify and assign your military specialty based on your college major, licenses, and aptitude test results."
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "제가 대학교에서 컴퓨터/소프트웨어를 전공하고 있는데, 제 전공을 살릴 수 있는 군 특기로 복무할 수 있나요?",
        text_en: "I am majoring in Computer Science / Software in college. Can I serve in a military specialty related to my major?"
      },
      {
        speaker: "적성분류관 NPC",
        speaker_en: "Aptitude Classification Officer NPC",
        char: "assets/doctor.png",
        charPos: "right",
        plateClass: "from-indigo-700 to-cyan-800 border-indigo-400/40",
        text: "물론입니다! 전공과 자격증 연계를 통해 [육군 정보통신/SW개발병] 또는 [공군 정보체계운영병] 특기로 적극 지원하실 수 있도록 적성을 부여했습니다.\n\n이제 최종 판정서 수령과 여비 정산을 위해 [수석판정관실]로 이동하겠습니다!",
        text_en: "Certainly! We have classified your military aptitude for Army IT/SW Developer or Air Force Information Systems Specialist.\n\nNow, let's proceed to the Chief Adjudicator office for your final result and travel allowance settlement!"
      }
    ],
    apiSource: "국가법령정보센터: 「병역법」 제14조의2 (적성분류 및 군특기 부여 기준)",
    apiSource_en: "National Law Information Center: 「Military Service Act」 Art. 14-2 (Aptitude Classification)",
    apiIcon: "database",
    isApi: true,
    widgetType: "APTITUDE_CONFIRM"
  },

  // [SCENE 12] 수석판정관실 - 판정보조관 확인 ➔ 수석판정관 최종 판정 & 여비 정산 (수석판정관 & 응원하는 힘찬이)
  {
    bg: "assets/adjudicator_room.jpg",
    char: "assets/adjudicator.png",
    speaker: "수석판정관 NPC",
    speaker_en: "Chief Adjudicator NPC",
    plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
    dialogues: [
      {
        speaker: "판정보조관 NPC",
        speaker_en: "Adjudication Assistant NPC",
        char: "assets/doctor_serious.png",
        charPos: "right",
        plateClass: "from-slate-700 to-blue-900 border-slate-400/40",
        text: "안녕하십니까! 판정보조관입니다. 김민우 님의 심리검사, 임상병리검사, 기본검사(BMI), 전문의 정밀 진료 및 적성분류 전산 데이터를 모두 대조·검증 완료했습니다.\n\n수석판정관님께 최종 판정을 상신합니다.",
        text_en: "Hello, I am the Adjudication Assistant. I have verified all data from your psychological test, lab tests, biometrics, specialist doctor evaluations, and aptitude classifications.\n\nSubmitting to Chief Adjudicator for final determination."
      },
      {
        speaker: "수석판정관 NPC",
        speaker_en: "Chief Adjudicator NPC",
        char: "assets/adjudicator.png",
        charPos: "right",
        plateClass: "from-purple-800 to-indigo-950 border-purple-400/40",
        text: "수검자 김민우 님! 오늘 오전부터 진행된 모든 검사를 무사히 마치셨습니다. 대단히 수고 많으셨습니다!\n\n종합 판정 결과 신체등급 [ {finalGrade} ] 판정 및 [ {disposition} ] 처분으로 최종 확정합니다.",
        text_en: "Examinee Minwoo Kim! You have completed all exams today. Great job!\n\nYour final physical grade is [ {finalGrade} ] with [ {disposition} ] disposition."
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "민우 님 축하드립니다! 오늘 수검에 따른 실시간 여비 [ {fare} ]도 {cardType} 계좌로 즉시 입금 완료되었습니다.\n\n최종 결과서를 확인하신 후, 탈의실로 이동하여 평상복으로 환복해 주세요!",
        text_en: "Minwoo, congratulations! Your travel allowance of [ {fare} ] has been deposited into your {cardType} account.\n\nAfter checking your final certificate, please proceed to the locker room to change into your normal clothes!"
      }
    ],
    apiSource: "공공데이터포털: 병무청_병역의무자 여비 지급 기준 데이터 (실시간 산정)",
    apiSource_en: "Public Data Portal: MMA Travel Allowance Standards (Real-time Calculation)",
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
        text: "민우 님, 검사복을 벗고 사물함에서 본인 옷으로 편안하게 환복해 주세요.\n\n사물함에 보관했던 스마트폰, 지갑, 챙겨온 서류 등 소지품을 빠짐없이 챙기시고 전자키를 반납함에 넣으시면 검사장의 모든 일정이 끝납니다!",
        text_en: "Minwoo, please change from your exam uniform back into your normal clothes.\n\nMake sure to take all belongings from your locker and return your key to finish the exam center schedule!"
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "사물함에서 옷 갈아입고 핸드폰이랑 지갑도 다 챙겼어! 이제 집으로 출발해 볼까?",
        text_en: "Changed clothes and packed my phone and wallet from the locker! Time to head home!"
      }
    ],
    apiSource: "국가법령정보센터: 「병역법」 및 병역판정검사 수검 절차 규정",
    apiSource_en: "National Law Information Center: 「Military Service Act」 & Physical Exam Procedures",
    apiIcon: "shirt",
    isApi: true,
    widgetType: "LOCKER_RETURN_CONFIRM"
  },

  // [SCENE 14] 집 도착 & 에필로그 - 제1화 완결 (환하게 웃는 민우 & 힘찬이)
  {
    bg: "assets/room.jpg",
    char: "assets/minwoo_happy.png",
    speaker: "김민우 (주인공)",
    speaker_en: "Minwoo Kim (Protagonist)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    dialogues: [
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "후아~ 드디어 집에 도착했다! 오늘 하루 병역판정검사 풀코스를 무사히 마치고 나니 마음이 정말 홀가분하고 뿌듯하네.\n\n스마트폰에 [나라사랑카드 여비 {fare} 입금 완료] 알림 문자랑 e-병무지갑 결과서도 바로 도착했어!",
        text_en: "Phew~ Finally back home! Having completed the full physical exam course, I feel relieved and proud.\n\nReceived the SMS notification for travel allowance [{fare}] deposit and the e-military wallet certificate on my phone!"
      },
      {
        speaker: "힘찬이 (병무청 AI 가이드)",
        speaker_en: "Himchan (MMA AI Guide)",
        char: "assets/himchan_cheer.png",
        charPos: "right",
        plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
        text: "민우 님, 오늘 하루 정말 수고 많으셨습니다!\n\n첫 병역판정검사부터 군 특기 설계, 그리고 앞으로의 병역 이행까지 대한민국 청춘의 모든 여정에 병무청이 항상 든든하게 함께하겠습니다!",
        text_en: "Minwoo, wonderful job today!\n\nFrom your first exam to career planning and future service, MMA will always stand firmly by your side!"
      },
      {
        speaker: "김민우 (주인공)",
        speaker_en: "Minwoo Kim (Protagonist)",
        char: "assets/minwoo_happy.png",
        charPos: "right",
        plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
        text: "가상 시뮬레이션으로 전 과정을 직접 체험해 보길 정말 잘했어. 대한민국 청년으로서 멋지게 당당하게 병역을 마주할 자신감이 생겼다!",
        text_en: "Experiencing the entire process virtually was truly worth it. As a proud young Korean, I now have the confidence to fulfill my military duty!"
      }
    ],
    apiSource: "병무청 공식: 병역판정검사 종합 안내 포털 (mma.go.kr)",
    apiSource_en: "MMA Official: Draft Physical Examination Comprehensive Portal (mma.go.kr)",
    apiIcon: "check-circle",
    isApi: true,
    widgetType: "EPISODE_COMPLETE"
  }
];
