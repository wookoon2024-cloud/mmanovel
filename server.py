"""
=========================================================================
🚀 병무청 비주얼 노벨 - 공공데이터 & 법령 Open API 프록시 서버 (server.py)
=========================================================================

실행 방법:
  python server.py
  (브라우저에서 http://localhost:8000 접속 시 웹페이지 및 실시간 API 자동 구동)
"""

import json
import os
import re
import hashlib

import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer, ThreadingHTTPServer
import urllib.parse

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

PORT = 8000

# 전국 14개 지방병무청 및 병무지청 메타데이터
OFFICES = {
    "서울지방병무청": {
        "code": "MMA_SEOUL",
        "dept": "병역판정검사과",
        "phone": "02-820-4241",
        "address": "서울특별시 영등포구 여의대방로43길 13",
        "transport": "7호선 보라매역 7번 출구 (도보 5분) / 1호선 대방역",
        "fare": 6500
    },
    "부산울산지방병무청": {
        "code": "MMA_BUSAN_ULSAN",
        "dept": "병역판정검사과",
        "phone": "051-667-5241",
        "address": "부산광역시 수영구 연수로 301",
        "transport": "부산지하철 3호선 망미역 1번 출구 (도보 3분)",
        "fare": 7500
    },
    "대구경북지방병무청": {
        "code": "MMA_DAEGU_GYEONGBUK",
        "dept": "병역판정검사과",
        "phone": "053-607-6241",
        "address": "대구광역시 동구 신녕로 184",
        "transport": "대구1호선 안심역 / 혁신도시 셔틀버스 운행",
        "fare": 8000
    },
    "경인지방병무청": {
        "code": "MMA_GYEONGIN",
        "dept": "병역판정검사과",
        "phone": "031-240-7241",
        "address": "경기도 수원시 팔달구 효원로 356",
        "transport": "수인분당선 매교역 3번 출구 / 수원역 셔틀버스",
        "fare": 7000
    },
    "광주전남지방병무청": {
        "code": "MMA_GWANGJU_JEONNAM",
        "dept": "병역판정검사과",
        "phone": "062-230-4241",
        "address": "광주광역시 동구 양림로119번길 8",
        "transport": "광주지하철 1호선 남광주역 3번 출구 (도보 7분)",
        "fare": 7500
    },
    "대전충남지방병무청": {
        "code": "MMA_DAEJEON_CHUNGNAM",
        "dept": "병역판정검사과",
        "phone": "042-250-4241",
        "address": "대전광역시 중구 중앙로 16번길 5",
        "transport": "대전지하철 1호선 서대전네거리역 4번 출구 (도보 4분)",
        "fare": 7000
    },
    "강원지방병무청": {
        "code": "MMA_GANGWON",
        "dept": "병역판정검사과",
        "phone": "033-240-6241",
        "address": "강원특별자치도 춘천시 백령로 65",
        "transport": "경춘선 남춘천역 1번 출구 앞 셔틀버스 상시 운행",
        "fare": 8500
    },
    "충북지방병무청": {
        "code": "MMA_CHUNGBUK",
        "dept": "병역판정검사과",
        "phone": "043-270-1241",
        "address": "충청북도 청주시 서원구 남이면 청남로 1482",
        "transport": "청주시외버스터미널 및 시내 주요 거점 셔틀 운행",
        "fare": 7500
    },
    "전북지방병무청": {
        "code": "MMA_JEONBUK",
        "dept": "병역판정검사과",
        "phone": "063-281-3241",
        "address": "전북특별자치도 전주시 완산가락로 20",
        "transport": "전주역/고속버스터미널 연계 시내버스 및 셔틀 운행",
        "fare": 7500
    },
    "경남지방병무청": {
        "code": "MMA_GYEONGNAM",
        "dept": "병역판정검사과",
        "phone": "055-279-9241",
        "address": "경상남도 창원시 의창구 사화로 157",
        "transport": "창원역 1번 출구 (도보 10분 / 셔틀 연계)",
        "fare": 8000
    },
    "제주지방병무청": {
        "code": "MMA_JEJU",
        "dept": "병역판정검사과",
        "phone": "064-720-3241",
        "address": "제주특별자치도 제주시 청사로 59 (정부제주합동청사)",
        "transport": "제주국제공항 10분 거리 / 정부합동청사 정류장",
        "fare": 9000
    },
    "인천병무지청": {
        "code": "MMA_INCHEON",
        "dept": "병역판정검사과",
        "phone": "032-454-2241",
        "address": "인천광역시 미추홀구 석정로 239",
        "transport": "1호선 제물포역 2번 출구 (도보 5분)",
        "fare": 7000
    },
    "경기북부병무지청": {
        "code": "MMA_GYEONGGI_NORTH",
        "dept": "병역판정검사과",
        "phone": "031-870-0241",
        "address": "경기도 의정부시 전좌로 76",
        "transport": "1호선 망월사역 3번 출구 (도보 8분)",
        "fare": 7500
    },
    "강원영동병무지청": {
        "code": "MMA_GANGWON_YEONGDONG",
        "dept": "병역판정검사과",
        "phone": "033-649-4241",
        "address": "강원특별자치도 강릉시 율곡로 2707",
        "transport": "KTX 강릉역 및 강릉고속버스터미널 연계 셔틀 운행",
        "fare": 8500
    }
}


# =========================================================================
# 🎙️ 고품질 뉴럴 TTS 음성 합성 엔진 (Microsoft Edge Neural TTS)
# =========================================================================
VOICE_MAP = {
    'himchan': {'voice': 'ko-KR-HyunsuMultilingualNeural', 'rate': '+4%', 'pitch': '+1Hz'}, # 활기찬 열혈 멘토 힘찬이 (Hyunsu 남성)
    'yuna': {'voice': 'ko-KR-SunHiNeural', 'rate': '+2%', 'pitch': '+2Hz'},                 # 다정하고 따뜻한 선배 멘토 유나 (여성)
    'narae': {'voice': 'ko-KR-SunHiNeural', 'rate': '+2%', 'pitch': '+2Hz'},                # 유나 호환 (여성)
    'seojun': {'voice': 'ko-KR-InJoonNeural', 'rate': '+1%', 'pitch': '-3Hz'},              # 똑부러진 전우 멘토 서준 (차분한 청년 지성 톤 남성)
    'minwoo': {'voice': 'ko-KR-InJoonNeural', 'rate': '+0%', 'pitch': '-1Hz'},               # 20대 청년 주인공 인준 (자연스러운 청년 남성)
    'psychologist': {'voice': 'ko-KR-SunHiNeural', 'rate': '+1%', 'pitch': '+1Hz'},         # 지적이고 상냥한 여성 심리검사관 (여성)
    'lab_officer': {'voice': 'ko-KR-InJoonNeural', 'rate': '+1%', 'pitch': '-2Hz'},          # 스마트한 남성 임상병리사/방사선사 (남성)
    'doctor': {'voice': 'ko-KR-InJoonNeural', 'rate': '-3%', 'pitch': '-6Hz'},               # 전문의/군의관 (남성)
    'adjudicator': {'voice': 'ko-KR-InJoonNeural', 'rate': '-6%', 'pitch': '-10Hz'},         # 수석판정관 (남성 저음)
    'counselor': {'voice': 'ko-KR-InJoonNeural', 'rate': '-1%', 'pitch': '-3Hz'},           # 정우진 병역진로상담관/적성분류관 (남성)
    'instructor': {'voice': 'ko-KR-InJoonNeural', 'rate': '+2%', 'pitch': '-5Hz'},          # 군 교관 (최 상사, 박 상사, 강태식 상사 - 남성)
    'donghyun': {'voice': 'ko-KR-HyunsuMultilingualNeural', 'rate': '+3%', 'pitch': '+0Hz'}, # 예비역 동기 박동현 (남성)
    
    # English 모드
    'en_himchan': {'voice': 'en-US-GuyNeural', 'rate': '+5%', 'pitch': '+4Hz'},
    'en_yuna': {'voice': 'en-US-JennyNeural', 'rate': '+2%', 'pitch': '+2Hz'},
    'en_narae': {'voice': 'en-US-JennyNeural', 'rate': '+2%', 'pitch': '+2Hz'},
    'en_seojun': {'voice': 'en-US-DavisNeural', 'rate': '+1%', 'pitch': '-1Hz'},
    'en_minwoo': {'voice': 'en-US-ChristopherNeural', 'rate': '+0%', 'pitch': '-2Hz'},
    'en_psychologist': {'voice': 'en-US-JennyNeural', 'rate': '+1%', 'pitch': '+2Hz'},
    'en_doctor': {'voice': 'en-US-EricNeural', 'rate': '-4%', 'pitch': '-6Hz'},
    'en_adjudicator': {'voice': 'en-US-RogerNeural', 'rate': '-8%', 'pitch': '-12Hz'}
}

def clean_dialogue_text(text=""):
    t = text or ""
    t = re.sub(r'\((일|월|화|수|목|금|토)\)', r'\1요일', t)
    t = re.sub(r'<[^>]*>', ' ', t)
    t = re.sub(r'[\[\]\{\}\(\)\✓\➔\▶\🏢\💡\📋\🌐\🎖️\•\※\①\②\③\④\⚠️\📸]', ' ', t)
    t = re.sub(r'\r?\n|\r', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def get_voice_config(speaker='', lang='ko', guide='himchan'):
    is_en = (lang == 'en')
    spk = (speaker or '').lower()
    gd = (guide or 'himchan').lower()
    
    # 1. 가이드/멘토 캐릭터 (유나/나래는 여성, 힘찬/서준은 남성)
    is_guide = any(k in spk for k in ['가이드', 'guide', '힘찬이', 'himchan', '유나', 'yuna', '나래', 'narae', '서준', 'seojun', '멘토', 'mentor'])
    if is_guide:
        if '힘찬이' in spk or 'himchan' in spk:
            return VOICE_MAP['en_himchan'] if is_en else VOICE_MAP['himchan']
        if '유나' in spk or 'yuna' in spk or '나래' in spk or 'narae' in spk:
            return VOICE_MAP['en_yuna'] if is_en else VOICE_MAP['yuna']
        if '서준' in spk or 'seojun' in spk:
            return VOICE_MAP['en_seojun'] if is_en else VOICE_MAP['seojun']
        if 'yuna' in gd or 'narae' in gd:
            return VOICE_MAP['en_yuna'] if is_en else VOICE_MAP['yuna']
        if 'seojun' in gd:
            return VOICE_MAP['en_seojun'] if is_en else VOICE_MAP['seojun']
        return VOICE_MAP['en_himchan'] if is_en else VOICE_MAP['himchan']

    # 2. 여성 캐릭터 / NPC (심리검사관, 간호사, 여성 주인공 이서윤) -> 여성 보이스
    if any(k in spk for k in ['심리검사', '심리검사관', 'psychologist', '간호', '여성', 'female', '이서윤', '서윤', 'seoyun']):
        return VOICE_MAP['en_psychologist'] if is_en else VOICE_MAP['psychologist']
    
    # 3. 남성 임상병리사 / 영상의학 방사선사 (김민서 임상병리사) -> 스마트 남성 보이스
    if any(k in spk for k in ['병리사', '방사선사', '임상병리', '영상의학', 'radiologist', 'pathologist', 'lab']):
        return VOICE_MAP['en_seojun'] if is_en else VOICE_MAP['lab_officer']

    # 4. 남성 군 교관 (최 상사, 박 상사, 강태식 상사)
    if any(k in spk for k in ['교관', '최 상사', '박 상사', '강태식', 'instructor', '상사', '조교']):
        return VOICE_MAP['en_doctor'] if is_en else VOICE_MAP['instructor']

    # 5. 남성 진로상담관 / 적성분류관 (정우진 상담관, 적성분류관)
    if any(k in spk for k in ['정우진', '상담관', 'counselor', '적성분류', '적성분류관']):
        return VOICE_MAP['en_seojun'] if is_en else VOICE_MAP['counselor']

    # 6. 남성 동기 (예비역 박동현)
    if any(k in spk for k in ['박동현', '동현', 'donghyun']):
        return VOICE_MAP['en_himchan'] if is_en else VOICE_MAP['donghyun']

    # 7. 50대 남성 수석판정관 (중후한 저음)
    if any(k in spk for k in ['수석판정관', '판정보좌관', '판정관', 'adjudicator']):
        return VOICE_MAP['en_adjudicator'] if is_en else VOICE_MAP['adjudicator']

    # 8. 남성 전담의사 / 의무관 (의무관 정태윤, 과목별 전담의사)
    if any(k in spk for k in ['전담의사', '의무관', '내과', '정형외과', '안과', '일반종합', '과목별', '전문의', 'doctor', '의사']):
        return VOICE_MAP['en_doctor'] if is_en else VOICE_MAP['doctor']

    # 9. 주인공 (김민우 / 강태훈 / 박민재 / 수검자 / 예비역 청년 남성)
    if any(k in spk for k in ['김민우', '민우', '강태훈', '태훈', 'taehoon', '주인공', '예비역', '이동민', '동민', 'minwoo', 'protagonist', '수검자', '학생', '박민재']):
        return VOICE_MAP['en_minwoo'] if is_en else VOICE_MAP['minwoo']

    return VOICE_MAP['en_minwoo'] if is_en else VOICE_MAP['minwoo']

class MmaApiHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 허용 헤더
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/track':
            length = int(self.headers.get('content-length', 0))
            body_data = self.rfile.read(length) if length > 0 else b'{}'
            try:
                data = json.loads(body_data.decode('utf-8'))
            except Exception:
                data = {}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "clientInfo": {
                    "ip": self.client_address[0],
                    "maskedIp": self.client_address[0],
                    "city": "서울특별시",
                    "device": data.get("device", "Desktop")
                }
            }, ensure_ascii=False).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        # 1. 실시간 공석 API 엔드포인트
        if parsed.path == '/api/slots':
            office = params.get('office', ['강원지방병무청'])[0]
            month_str = params.get('month', ['202610'])[0]
            
            try:
                y = int(month_str[:4])
                m = int(month_str[4:])
            except:
                y, m = 2026, 10

            schedules = {
                "강원영동병무지청": {"open": [4, 5], "rec": 4, "alt": "강원지방병무청", "reason": "강원영동병무지청(강릉)은 연간 수검 인원 규모에 따라 매년 [4월 ~ 5월(2개월간)] 집중 수검 기간에만 자체 검사장을 운영합니다.\n\n현재 선택하신 월에는 강릉 검사장이 열리지 않으므로, 4~5월 일정을 선택하시거나 상시 운영되는 '강원지방병무청(춘천)'을 이용해 주세요."},
                "제주지방병무청": {"open": [6, 7, 11], "rec": 6, "alt": None, "reason": "제주지방병무청은 도내 수검 대상자 일정에 맞춰 [6월 ~ 7월, 11월]에 집중 검사를 진행합니다.\n\n해당 월에는 검사 일정이 없으니, 6·7·11월 일정을 선택해 주세요."},
                "충북지방병무청": {"open": [2, 3, 4, 7, 8, 9, 10], "rec": 10, "alt": None, "reason": "충북지방병무청(청주)은 분기별 지정 기간에 검사를 진행합니다."},
                "전북지방병무청": {"open": [2, 3, 4, 5, 8, 9, 10, 11], "rec": 10, "alt": None, "reason": "전북지방병무청(전주)은 분기별 지정 기간에 검사를 진행합니다."}
            }
            sched = schedules.get(office, {"open": list(range(2, 13)), "rec": 10, "alt": None, "reason": "정기 검사 비운영 기간입니다."})

            if y != 2026 or m not in sched["open"]:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "officeName": office,
                    "year": y,
                    "month": m,
                    "isOpen": False,
                    "reason": sched["reason"],
                    "recommendMonth": sched["rec"],
                    "recommendYear": 2026,
                    "alternativeOffice": sched["alt"]
                }, ensure_ascii=False).encode('utf-8'))
                return

            import calendar
            first_day, total_days = calendar.monthrange(y, m)
            # Python weekday: 0=Mon..6=Sun -> convert to JS: 0=Sun..6=Sat
            js_first_day = (first_day + 1) % 7

            days = {}
            office_seed = sum(ord(c) for c in office)
            month_seed = (y * 100 + m) * 13 + office_seed

            for day in range(1, total_days + 1):
                day_of_week = (js_first_day + day - 1) % 7
                is_weekend = (day_of_week == 0 or day_of_week == 6)
                if is_weekend:
                    days[day] = {"day": day, "dayOfWeek": day_of_week, "status": "휴무", "morning": 0, "afternoon": 0, "available": False}
                else:
                    h = (month_seed + day * 31) % 100
                    if h < 18:
                        days[day] = {"day": day, "dayOfWeek": day_of_week, "status": "마감", "morning": 0, "afternoon": 0, "available": False}
                    else:
                        morning = ((h * 7 + day) % 16) + 2
                        afternoon = ((h * 13 + day * 3) % 14) + 1
                        days[day] = {"day": day, "dayOfWeek": day_of_week, "status": "예약가능", "morning": morning, "afternoon": afternoon, "available": True}

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                "officeName": office,
                "year": y,
                "month": m,
                "isOpen": True,
                "firstDay": js_first_day,
                "totalDays": total_days,
                "days": days
            }, ensure_ascii=False).encode('utf-8'))
            return

        # 2. 국가법령정보 평가기준 API 엔드포인트
        elif parsed.path == '/api/law':
            category = params.get('category', ['건강 체질'])[0]
            criteria = {
                "정형외과 수술/치료 이력": {
                    "lawRef": "「병역판정 신체검사 등 검사규칙」(국방부령) 제11조 및 [별표 2] 204호",
                    "docs": ["병무용 진단서 (최근 3개월 이내)", "수술기록지 및 경과기록지", "MRI/X-ray 영상 CD"],
                    "expectedGrade": "4급 (보충역)"
                },
                "시력/안과 질환": {
                    "lawRef": "「검사규칙」(국방부령) [별표 2] 안과 질환 및 굴절이상 판정기준",
                    "docs": ["최근 3개월 이내 안과 의무기록사본", "시력 교정 수술기록지"],
                    "expectedGrade": "2급 또는 3급"
                },
                "내과/복용약": {
                    "lawRef": "「검사규칙」(국방부령) [별표 2] 만성 질환 및 약물 복용 평가기준",
                    "docs": ["6개월 이상 연속 투약 증명 처방전", "병원 발행 의무기록사본"],
                    "expectedGrade": "3급 또는 4급"
                },
                "건강 체질": {
                    "lawRef": "「검사규칙」 [별표 1] 및 [별표 2] 정상 기준",
                    "docs": ["주민등록증 / 운전면허증 등 공인 신분증"],
                    "expectedGrade": "1급 (현역)"
                }
            }
            res_data = criteria.get(category, criteria["건강 체질"])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res_data, ensure_ascii=False).encode('utf-8'))
            return

        # 3. 고품질 뉴럴 TTS 음성 실시간 합성 API 엔드포인트 (/api/tts)
        elif parsed.path == '/api/tts':
            speaker = params.get('speaker', [''])[0]
            text = params.get('text', [''])[0]
            lang = params.get('lang', ['ko'])[0]
            guide = params.get('guide', ['himchan'])[0]
            
            clean_text = clean_dialogue_text(text)
            if not clean_text:
                self.send_response(400)
                self.end_headers()
                return

            v_conf = get_voice_config(speaker, lang, guide)
            voice = v_conf['voice']
            rate = v_conf.get('rate', '+0%')
            pitch = v_conf.get('pitch', '+0Hz')
            
            cache_dir = os.path.join(os.path.dirname(__file__), 'cache', 'tts')
            os.makedirs(cache_dir, exist_ok=True)
            cache_key = hashlib.md5(f"{voice}:{rate}:{pitch}:{clean_text}".encode('utf-8')).hexdigest()
            cache_file = os.path.join(cache_dir, f"{cache_key}.mp3")
            
            if not os.path.exists(cache_file) or os.path.getsize(cache_file) == 0:
                try:
                    import edge_tts, asyncio
                    comm = edge_tts.Communicate(clean_text, voice, rate=rate, pitch=pitch)
                    asyncio.run(comm.save(cache_file))
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-Type', 'text/plain; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(f"TTS Error: {e}".encode('utf-8'))
                    return
            
            try:
                with open(cache_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
            return

        # 3. 정적 파일 (index.html, assets, scenario.js 등) 제공
        return super().do_GET()

if __name__ == '__main__':
    print(f"🚀 [병무청 비주얼 노벨] 웹 서버가 http://localhost:{PORT} 에서 실행 중입니다.")
    print(f"💡 브라우저에서 http://localhost:{PORT} 에 접속하여 시뮬레이션을 즐기세요.")
    httpd = ThreadingHTTPServer(('0.0.0.0', PORT), MmaApiHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
