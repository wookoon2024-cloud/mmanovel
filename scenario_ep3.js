/**
 * =========================================================================
 * 📜 [병무청 비주얼 노벨 제3화 - 전체 시나리오 대본 데이터 (scenario_ep3.js)]
 * =========================================================================
 * 
 * 🎮 제3화: 「내 꿈을 찾는 병역진로설계 (청춘 디딤돌 편)」
 * 
 * 💡 시나리오 흐름 및 등장인물:
 * 0. [ep3_campus_bench.jpg] 캠퍼스 벤치: 1학년 2학기 종강 앞둔 군 입영 및 경력 단절 고민 (주인공: ep3_hero_worried)
 * 1. [ep3_campus_bench.jpg] 병무청 AI 가이드 힘찬이의 전격 등장 & 멘토 선택 (힘찬이: himchan_smile)
 * 2. [ep3_center_entrance.jpg] 미래를 여는 스마트 허브: 전국 병역진로설계지원센터 입구 & 3대 코스 브리핑 (힘찬이: himchan_cheer)
 * 3. [ep3_diagnosis_room.jpg] Step 1: 직업선호도 및 군 적성 정밀 진단 키오스크 (주인공: ep3_hero_base) [위젯: EP3_PROFILE_TEST]
 * 4. [ep3_consulting_room.jpg] Step 2: 전문 병역진로상담관의 1:1 맞춤 특기 컨설팅 (정우진 상담관: ep3_counselor_smile) [위젯: EP3_SPECIALTY_CARDS]
 * 5. [ep3_vr_experience.jpg] Step 3: 첨단 국방 테크를 체험하다! 모의 정찰 드론 & 레이저 사격 (강태식 상사: ep3_instructor_tech) [위젯: EP3_DRONE_SIM]
 * 6. [ep3_roadmap_lounge.jpg] Step 4: 입영 희망월 선택 & 합격 가산점 시뮬레이터 (정우진 상담관: ep3_counselor_smile) [위젯: EP3_SAVINGS_CALC]
 * 7. [ep3_roadmap_lounge.jpg] 군 복무 3대 황금 혜택: 대학 학점 인정, 국가자격증 무료 취득, 1,400만원 장병내일준비적금 (정우진 상담관: ep3_counselor_smile)
 * 8. [ep3_certificate_hall.jpg] 청춘의 디딤돌: 나만의 1:1 맞춤 병역진로설계 추천서 완성 & 최종 수여 (주인공: ep3_hero_bright) [위젯: EP3_ROADMAP_CERT]
 */

const SCENARIOS_EP3 = [
  // [SCENE 0] 캠퍼스 벤치 - 스무 살의 깊은 군 입영 및 진로 고민
  {
    bg: "assets/ep3_campus_bench.jpg",
    char: "assets/ep3_hero_worried.png",
    charPos: "right",
    speaker: "{name} (대학교 1학년)",
    speaker_en: "{name} (College Freshman)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "휴... 벌써 1학년 2학기 종강이 눈앞인데, 동기들은 하나둘 군 휴학계를 내고 입대 날짜를 잡고 있어...\n나는 대체 언제, 어느 부대로 가야 하는 걸까?\n\n선배들은 '군대 가면 18개월 동안 머리만 굳고 코딩 감 다 잃는다'고 겁만 주는데...\n내 전공인 소프트웨어 개발도 살리고 전역 후 취업에도 도움 되는 방법은 정말 없는 걸까?",
    text_en: "Phew... First-year second semester is already coming to an end, and my classmates are applying for military leaves one by one...\nWhen and where on earth should I enlist?\n\nSeniors always scare me saying '18 months in the military just dulls your brain and resets all your coding skills'...\nIs there really no way to utilize my software major and turn military service into a real asset for future employment?",
    apiSource: "[병역판정] 2026년도 병역판정검사 현역 대상자 통지 연동",
    apiSource_en: "[Draft Notice] 2026 Active Duty Draft Notice Integration",
    apiSourceUrl: "https://mw.mma.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 1] 캠퍼스 벤치 - 힘찬이의 전격 등장: "군 복무는 경력 단절이 아닌 도약의 디딤돌!"
  {
    bg: "assets/ep3_campus_bench.jpg",
    char: "assets/himchan_smile.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "충성! 안녕하십니까 {name} 님! 대한민국 청년들의 병역 나침반, 병무청 AI 가이드 '힘찬이'입니다!\n혼자서 군 입영과 진로 고민으로 머리를 싸매고 계셨군요!\n\n많은 분들이 '군대 가면 18개월 동안 경력이 단절된다'고 오해하시지만, 사실은 180도 정반대입니다!\n적성과 전공에 딱 맞는 특기를 찾아 복무하면, 군 생활 자체가 사회에서 가장 인정받는 탄탄한 실무 경력이 되거든요!",
    text_en: "Loyalty! Hello {name}! I am 'Himchan', the MMA AI Guide and career compass for Korean youth!\nYou've been agonizing over military enlistment and career paths all by yourself!\n\nMany think '18 months in the military interrupts your career', but that couldn't be further from the truth!\nIf you match your aptitude and major with the right military specialty, your service becomes solid, recognized real-world experience!",
    apiSource: null,
    apiSource_en: null,
    isApi: false,
    widgetType: "GUIDE_SELECT_INTRO"
  },

  // [SCENE 2] 미래를 여는 스마트 허브: 병역진로설계지원센터 입구
  {
    bg: "assets/ep3_center_entrance.jpg",
    char: "assets/himchan_cheer.png",
    charPos: "right",
    speaker: "힘찬이 (병무청 AI 가이드)",
    speaker_en: "Himchan (MMA AI Guide)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "짜잔! 이곳이 바로 전국의 수많은 청년들이 미래를 설계하러 찾아오는 [병역진로설계지원센터]입니다!\n서울, 수원, 대전, 대구, 광주, 부산, 춘천 등 전국 14개 주요 권역에서 운영되고 있어요.\n\n오늘 {name} 님이 거치실 코스는 1️⃣ 직업선호도 및 군 적성 정밀 검사, 2️⃣ 1:1 심층 특기 컨설팅, 3️⃣ 첨단 모의 군 장비(VR/드론/사격) 체험입니다! 어서 스마트 진단실로 들어가 볼까요?",
    text_en: "Ta-da! This is the 'Military Service Career Planning Support Center', visited by youths nationwide!\nIt operates across 14 major regional hubs including Seoul, Suwon, Daejeon, Daegu, Gwangju, Busan, and Chuncheon.\n\nToday's course for {name}: 1️⃣ Vocational Aptitude & Military Specialty Test, 2️⃣ 1:1 In-depth Specialty Consulting, 3️⃣ High-tech Military Equipment Simulation (VR/Drone/Shooting)! Let's head to the Smart Diagnosis Room!",
    apiSource: "[근거 법령] 「병역법」 제14조의3(병역진로설계의 지원) - 국가 차원의 청년 경력개발 지원",
    apiSource_en: "[Legal Basis] Military Service Act Art. 14-3 (Career Support) - National Youth Career Development",
    apiSourceUrl: "https://www.mma.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 3] Step 1: 직업선호도 및 군 적성 정밀 진단
  {
    bg: "assets/ep3_diagnosis_room.jpg",
    char: "assets/ep3_hero_base.png",
    charPos: "right",
    speaker: "{name} (대학교 1학년)",
    speaker_en: "{name} (College Freshman)",
    plateClass: "from-slate-700 to-slate-900 border-slate-500/40",
    text: "스마트 터치스크린 키오스크 앞에 앉았어. 전공 계열과 취득한 자격증, 평소 흥미를 느끼는 분야를 차례대로 터치하면 AI가 나에게 딱 맞는 군 특기 군을 실시간 매칭해 준다고 해.\n\n어디 내 전공과 관심사를 꼼꼼하게 입력해 볼까?",
    text_en: "Sitting in front of the smart touchscreen kiosk. By selecting my major, earned certificates, and areas of interest, the AI will match me with the ideal military specialties in real time.\n\nLet's carefully input my academic background and interests!",
    apiSource: "[검사 연동] 고용노동부 워크넷 직업선호도검사 & 병무청 군적성 표준 매트릭스",
    apiSource_en: "[Test Integration] MOEL Worknet Vocational Test & MMA Military Aptitude Standard Matrix",
    apiSourceUrl: "https://www.work.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP3_PROFILE_TEST"
  },

  // [SCENE 4] Step 2: 전문 병역진로상담관의 1:1 맞춤 컨설팅
  {
    bg: "assets/ep3_consulting_room.jpg",
    char: "assets/ep3_counselor_smile.png",
    charPos: "right",
    speaker: "정우진 (전문 병역진로상담관)",
    speaker_en: "Woojin Jeong (Senior Career Counselor)",
    plateClass: "from-indigo-700 to-sky-800 border-indigo-400/40",
    text: "반갑습니다, {name} 님! 오늘 진로설계를 전담할 정우진 상담관입니다.\n방금 완료하신 적성 진단 결과를 보니 IT·소프트웨어 개발과 네트워크 분야에 무려 98.5%의 최고 적합도가 나왔군요!\n\n육·해·공군에는 {name} 님의 전공 역량을 200% 발휘할 수 있는 전문 기술 특기들이 다양하게 준비되어 있습니다. 모니터의 맞춤 특기 비교 카드를 함께 살펴보실까요?",
    text_en: "Welcome, {name}! I am Senior Counselor Woojin Jeong, in charge of your military career design.\nLooking at your aptitude diagnosis, you have scored an astounding 98.5% compatibility in IT, software development, and network systems!\n\nThe Army, Navy, and Air Force all have specialized technical fields where you can unleash 200% of your potential. Let's explore your tailored specialty comparison cards together!",
    apiSource: "[특기 DB] 육·해·공·해병대 현역 모집병 직무기술서 & 자격기준 공공데이터",
    apiSource_en: "[Specialty DB] ROK Army, Navy, Air Force, Marine Corps Recruitment Open Data",
    apiSourceUrl: "https://data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP3_SPECIALTY_CARDS"
  },

  // [SCENE 5] Step 3: 첨단 국방 테크를 체험하다! 모의 군 장비 체험관
  {
    bg: "assets/ep3_vr_experience.jpg",
    char: "assets/ep3_instructor_tech.png",
    charPos: "right",
    speaker: "강태식 상사 (체험관 교관)",
    speaker_en: "Master Sgt. Kang (Simulation Instructor)",
    plateClass: "from-amber-700 to-orange-800 border-amber-400/40",
    text: "자! 머리로 상담을 받았으니 이번엔 최첨단 군 장비를 직접 손으로 조작해 볼 차례입니다!\n이곳은 K2 전차, 차륜형 장갑차 VR 시뮬레이터와 정밀 레이저 모의사격, 그리고 미래 국방의 핵심인 '전술 드론봇'을 직접 조종할 수 있는 스마트 실습실입니다!\n\n{name} 님, 조종기를 잡고 가상 산악 지형의 적 기지를 정찰하고 정밀 타격하는 미션에 도전해 보십시오!",
    text_en: "Alright! Now that you've gained theoretical clarity, it's time to get hands-on with cutting-edge military hardware!\nThis smart lab features VR K2 Tank simulators, precision laser shooting ranges, and tactical drone-bots—the core of future defense!\n\n{name}, grab the tactical controller and execute the mountain reconnaissance and precision strike mission!",
    apiSource: "[시뮬레이터] 미래 국방 드론봇 전투체계 및 VR 전술장비 모의 훈련 시스템",
    apiSource_en: "[Simulator] Future Defense Drone-Bot Combat System & VR Tactical Training Simulation",
    apiSourceUrl: "https://www.dapa.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP3_DRONE_SIM"
  },

  // [SCENE 6] Step 4: 합격 전략! 입영 희망월 선택 & 가산점 시뮬레이터
  {
    bg: "assets/ep3_roadmap_lounge.jpg",
    char: "assets/ep3_counselor_smile.png",
    charPos: "right",
    speaker: "정우진 (전문 병역진로상담관)",
    speaker_en: "Woojin Jeong (Senior Career Counselor)",
    plateClass: "from-indigo-700 to-sky-800 border-indigo-400/40",
    text: "드론 조종 솜씨가 아주 훌륭했습니다! 이제 복학 일정에 맞춰 가장 이상적인 '입영 희망월'을 정하고, 100% 합격할 수 있는 가산점 로드맵을 설계해 볼까요?\n\n모집병은 경쟁률이 존재하지만, 헌혈·사회봉사·전공 자격증, 그리고 우리 병역진로설계센터 추천 가산점을 더하면 원하는 달에 확실히 합격할 수 있습니다! 가산점 계산기로 합격률을 점검해 보시죠!",
    text_en: "Outstanding piloting skills! Now let's determine your ideal enlistment month aligned with your university return semester, and build an extra-point roadmap to ensure 100% acceptance!\n\nWhile specialized recruitment has competition, extra points from blood donations, volunteering, licenses, and our Center recommendation ensure stable acceptance! Let's check your acceptance rate with our calculator!",
    apiSource: "[실시간 연동] 공공데이터포털 - 병무청_모집병_월별_경쟁률_및_배점기준 Open API",
    apiSource_en: "[Real-time API] Public Data Portal - MMA Monthly Recruitment Competition & Points API",
    apiSourceUrl: "https://data.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP3_SAVINGS_CALC"
  },

  // [SCENE 7] 군 복무 3대 황금 혜택: 학점 인정, 국가자격증, 1,400만원 목돈!
  {
    bg: "assets/ep3_roadmap_lounge.jpg",
    char: "assets/ep3_counselor_smile.png",
    charPos: "right",
    speaker: "정우진 (전문 병역진로상담관)",
    speaker_en: "Woojin Jeong (Senior Career Counselor)",
    plateClass: "from-indigo-700 to-sky-800 border-indigo-400/40",
    text: "{name} 님, 특기 합격뿐 아니라 군 복무 중 누릴 수 있는 청년 지원 3대 황금 혜택도 기억해 두세요!\n\n1️⃣ 군 복무 경험 대학 학점 인정 (최대 12~15학점 이수 인정!)\n2️⃣ 국가기술자격증 무료 취득 (정보처리기사 등 응시료 전액 지원)\n3️⃣ 장병내일준비적금 (정부 100% 매칭지원금으로 전역 시 약 1,400만원 이상의 목돈 수령!)\n군 복무는 시간 낭비가 아니라 미래를 위한 최고의 부트캠프입니다!",
    text_en: "{name}, along with winning your specialty, don't miss the 3 golden benefits available during your service!\n\n1️⃣ University Credits for Military Service (Up to 12-15 credits recognized!)\n2️⃣ 100% Free National Technical Certifications (Exam fees fully funded for Engineer Information Processing etc.)\n3️⃣ Tomorrow Prep Savings Account (With 100% government matching subsidy, save over 14M KRW upon discharge!)\nMilitary service is not lost time; it is the ultimate career bootcamp for your future!",
    apiSource: "[청년지원] 국방부 군복무학점인정제 & 기획재정부 장병내일준비적금 매칭지원사업",
    apiSource_en: "[Youth Support] MND University Credit System & MOEF Tomorrow Prep Savings Matching Program",
    apiSourceUrl: "https://www.mnd.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: null
  },

  // [SCENE 8] 청춘의 디딤돌: 나만의 1:1 맞춤 병역진로설계서 완성!
  {
    bg: "assets/ep3_certificate_hall.jpg",
    char: "assets/ep3_hero_bright.png",
    charPos: "right",
    speaker: "{name} (대학교 1학년)",
    speaker_en: "{name} (College Freshman)",
    plateClass: "from-blue-700 to-indigo-800 border-blue-400/40",
    text: "상담관님과 힘찬이 덕분에 내 전공을 살릴 수 있는 육군 SW개발병 특기와 내년 3월 입영 로드맵이 완벽하게 완성됐어!\n\n군 입대가 막연한 두려움이 아닌, 내 인생과 커리어를 한 단계 업그레이드할 수 있는 멋진 디딤돌로 느껴져!\n내 손으로 완성한 [병역진로설계 추천서]를 소중히 간직하고, 당당하게 국방의 의무를 다하고 올 거야!",
    text_en: "Thanks to Counselor Jeong and Himchan, my Army SW Developer specialty roadmap and March enlistment schedule are perfectly set!\n\nEnlistment no longer feels like a vague fear, but an exhilarating stepping stone to upgrade my life and career!\nI'll cherish my personalized 'Military Service Career Recommendation' and fulfill my sacred duty with absolute pride!",
    apiSource: "[수료 발급] 병무청 전자 병역진로설계 추천서 (e-병무지갑 인증)",
    apiSource_en: "[Certificate] Official MMA Electronic Career Recommendation (e-Wallet Authenticated)",
    apiSourceUrl: "https://mw.mma.go.kr",
    apiIcon: "database",
    isApi: true,
    widgetType: "EP3_ROADMAP_CERT"
  }
];
