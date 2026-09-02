import os, re, json, asyncio, edge_tts

os.makedirs('assets/audio', exist_ok=True)

VOICE_MAP_KO = {
    'himchan': ('ko-KR-HyunsuNeural', '+6%', '+4Hz'),       # 힘찬이: 활기찬 소년/청년 가이드 현수
    'minwoo': ('ko-KR-InJoonNeural', '+0%', '-2Hz'),        # 민우: 20대 대학생 청년 주인공 인준
    'doctor': ('ko-KR-InJoonNeural', '-4%', '-8Hz'),        # 전문의/군의관/의무관: 진중한 30대 의사 인준 바리톤
    'adjudicator': ('ko-KR-InJoonNeural', '-8%', '-14Hz'),  # 수석판정관: 묵직한 50대 최고 판정관 딥 베이스
    'counselor': ('ko-KR-InJoonNeural', '-2%', '-4Hz')       # 상담관: 차분하고 지적인 남성 멘토
}

VOICE_MAP_EN = {
    'himchan': ('en-US-GuyNeural', '+5%', '+4Hz'),
    'minwoo': ('en-US-ChristopherNeural', '+0%', '-2Hz'),
    'doctor': ('en-US-EricNeural', '-4%', '-6Hz'),
    'adjudicator': ('en-US-RogerNeural', '-8%', '-12Hz'),
    'counselor': ('en-US-ChristopherNeural', '-2%', '-4Hz')
}

def get_voice_ko(speaker):
    spk = speaker.lower()
    if '힘찬이' in spk or 'himchan' in spk: return VOICE_MAP_KO['himchan']
    if '민우' in spk or 'minwoo' in spk: return VOICE_MAP_KO['minwoo']
    if '수석판정관' in spk or '판정관' in spk: return VOICE_MAP_KO['adjudicator']
    if '정형외과' in spk or '전문의' in spk or '의무관' in spk or '의사' in spk or '병리사' in spk or '방사선사' in spk or '상담관' in spk:
        return VOICE_MAP_KO['doctor']
    return VOICE_MAP_KO['minwoo']

def get_voice_en(speaker):
    spk = speaker.lower()
    if 'himchan' in spk or '힘찬이' in spk: return VOICE_MAP_EN['himchan']
    if 'minwoo' in spk or '민우' in spk: return VOICE_MAP_EN['minwoo']
    if 'adjudicator' in spk or '판정관' in spk: return VOICE_MAP_EN['adjudicator']
    if 'doctor' in spk or 'medical' in spk or '전문의' in spk or 'pathologist' in spk or 'radiologist' in spk:
        return VOICE_MAP_EN['doctor']
    return VOICE_MAP_EN['minwoo']

def clean_text(text):
    text = re.sub(r'<[^>]*>', ' ', text)
    text = re.sub(r'\{[^}]*\}', '강원지방병무청', text)
    text = re.sub(r'\[|\]|\(|\)|✓|➔|▶|🏢|💡|📋|🌐|🎖️|•|※|①|②|③|④|⚠️', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

with open('all_chunks.json', 'r', encoding='utf-8') as f:
    chunks = json.load(f)

tasks = []

# 1. All dialogue chunks from all 15 scenes
for c in chunks:
    s_idx = c['sceneIdx']
    d_idx = c['dialogueIdx']
    spk = c['speaker']
    spk_en = c['speaker_en']
    txt_ko = clean_text(c['text_ko'])
    txt_en = clean_text(c['text_en'])
    if txt_ko:
        tasks.append(('ko', spk, txt_ko, f'assets/audio/voice_{s_idx}_{d_idx}_ko.mp3'))
    if txt_en:
        tasks.append(('en', spk_en or spk, txt_en, f'assets/audio/voice_{s_idx}_{d_idx}_en.mp3'))

# 2. Announcements
announcements = [
    ('ann_locker', '힘찬이 (병무청 AI 가이드)', '환복과 사물함 보관이 완료되었습니다! 이제 본격적인 첫 번째 순서인 2층 심리검사실로 이동하겠습니다.', 'Locker storage and uniform change complete! Proceeding to the 2nd floor psychological testing hall.'),
    ('ann_psych', '심리상담관 NPC', '심리검사 작성이 모두 완료되었습니다! 이제 채혈, 소변검사, 흉부 X-ray 촬영을 위해 임상병리검사실과 영상의학실로 이동하겠습니다.', 'Psychological test complete! Proceeding to the pathology and radiology labs.'),
    ('ann_lab', '임상병리사 NPC', '임상병리 검사를 무사히 마쳤습니다! 이제 키와 몸무게, 혈압을 측정하는 자동 신체계측실로 이동하겠습니다.', 'Pathology exam complete! Moving to the automated biometric examination room.'),
    ('ann_bmi', '의무관 NPC', '신체계측이 완료되었습니다! 민우 님이 제출하신 관절 질환 서류를 정밀 진단받기 위해 정형외과 전문의 진료실로 이동하겠습니다.', 'Biometrics complete! Proceeding to the Orthopedic specialist clinic.'),
    ('ann_doctor', '정형외과 전담의사 NPC', '정형외과 전문의 소견이 전산에 등록되었습니다! 이제 최종 판정서 수령과 여비 정산을 위해 1층 수석판정관실로 이동하겠습니다.', 'Specialist evaluation recorded! Moving to the chief adjudicator office for final results.'),
    ('ann_health', '힘찬이 (병무청 AI 가이드)', '좋습니다! 맞춤형 구비서류 점검을 완료했습니다. 이제 검사 당일 서울지방병무청 1층 로비 접수데스크로 이동하겠습니다!', 'Great! Customized documents verified. Moving to the virtual examination reception lobby.'),
    ('ann_card', '힘찬이 (병무청 AI 가이드)', '나라사랑카드 등록이 완료되었습니다! 이제 RFID 스마트 팔찌를 수령하고 전용 검사복으로 환복하기 위해 1층 전용 탈의실로 이동하겠습니다.', 'Nara Sarang Card registered! Proceeding to the locker room to change into examination uniform.')
]

for ann_id, spk, txt_ko, txt_en in announcements:
    tasks.append(('ko', spk, clean_text(txt_ko), f'assets/audio/{ann_id}_ko.mp3'))
    tasks.append(('en', spk, clean_text(txt_en), f'assets/audio/{ann_id}_en.mp3'))

# 3. Direct interactive dialogues
direct_dialogues = [
    ('direct_bmi_step2', '김민우 (주인공)', '키와 몸무게 측정이 끝났네. 옆에 있는 자동 혈압계에 오른팔을 쑥 넣었어. 호흡을 편안하게 유지해야 혈압이 정확하게 측정된댔지.', 'Height and weight measurement done. Inserted my right arm into the automatic blood pressure monitor.'),
    ('direct_bmi_step3', '의무관 NPC', '혈압 120/80 정상입니다! 이어서 5m 전방 시력표와 색신 책자 검사를 진행했습니다. 좌 1.0 / 우 1.0 정상입니다. 이제 기본검사 계측 결과를 확인해 볼까요?', 'Blood pressure 120/80 is normal! Measured eyesight and color vision, both eyes 1.0 normal.'),
    ('direct_bmi_calc_disease', '의무관 NPC', '기본검사 계측이 완료되었습니다. 사전에 등록하신 정형외과 수술 서류의 정밀 심사를 위해 전문의 진료실로 이동해 주세요!', 'Basic biometric exam complete. Please proceed to the Specialist Clinic for review of your medical documents.'),
    ('direct_bmi_calc_normal', '의무관 NPC', '기본검사 결과 신장, 체중, 혈압, 시력 측정이 모두 완료되었습니다! 전공과 적성을 고려한 군 특기 분류 및 병역진로설계를 위해 적성분류실로 이동해 주세요!', 'Basic biometric exam complete! Please proceed to the Aptitude Center for military specialty assignment.'),
    ('direct_lab_step2', '김민우 (주인공)', '화장실에 도착했어. 설명대로 처음 나오는 1~2초간의 소변은 변기에 살짝 버리고, 깨끗한 중간 소변을 컵의 1/3 정도 받아서 검체 보관함에 제출하자!', 'Arrived at the restroom. I discard the first 1-2 seconds of urine, collect the midstream urine in 1/3 of the cup, and submit it into the specimen box!'),
    ('direct_lab_step3', '임상병리사 NPC', '소변 검체 확인했습니다! 이어서 혈액 검사를 위해 채혈을 진행합니다. 채혈 부위는 멍이 들지 않도록 문지르지 마시고 5분간 꾹 눌러서 지혈해 주세요!', 'Urine sample confirmed! Now collecting blood sample. Press firmly with alcohol cotton for 5 minutes without rubbing to prevent bruising!'),
    ('direct_lab_step4', '영상의학 방사선사 NPC', '흉부 X-ray 촬영대 앞에 가슴을 밀착해 주세요. 숨을 깊게 들이마시고 참으세요! 촬영이 모두 끝났습니다. 다음 검사인 기본검사실로 이동합니다.', 'Please stand firmly against the X-ray board. Deep breath in and hold it! Imaging complete. Proceed to the Basic Examination Room.')
]

for dir_id, spk, txt_ko, txt_en in direct_dialogues:
    tasks.append(('ko', spk, clean_text(txt_ko), f'assets/audio/{dir_id}_ko.mp3'))
    tasks.append(('en', spk, clean_text(txt_en), f'assets/audio/{dir_id}_en.mp3'))

print(f'Total audio tasks to synthesize: {len(tasks)}')

async def generate_single(lang, spk, text, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return
    try:
        if lang == 'ko':
            voice, rate, pitch = get_voice_ko(spk)
        else:
            voice, rate, pitch = get_voice_en(spk)
        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        await communicate.save(out_path)
        print(f'Generated: {out_path}')
    except Exception as e:
        print(f'Failed {out_path}: {e}')

async def main():
    for lang, spk, text, out_path in tasks:
        await generate_single(lang, spk, text, out_path)
        await asyncio.sleep(0.04)
    print('ALL COMPREHENSIVE AI MALE VOICES GENERATED!')

asyncio.run(main())
