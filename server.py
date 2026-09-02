"""
=========================================================================
🚀 병무청 비주얼 노벨 - 공공데이터 & 법령 Open API 프록시 서버 (server.py)
=========================================================================

실행 방법:
  python server.py
  (브라우저에서 http://localhost:8000 접속 시 웹페이지 및 실시간 API 자동 구동)
"""

import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.parse

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

        # 3. 정적 파일 (index.html, assets, scenario.js 등) 제공
        return super().do_GET()

if __name__ == '__main__':
    print(f"🚀 [병무청 비주얼 노벨] 웹 서버가 http://localhost:{PORT} 에서 실행 중입니다.")
    print(f"💡 브라우저에서 http://localhost:{PORT} 에 접속하여 시뮬레이션을 즐기세요.")
    httpd = HTTPServer(('0.0.0.0', PORT), MmaApiHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
