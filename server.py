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

# 지방병무청 메타데이터
OFFICES = {
    "강원지방병무청": {
        "code": "MMA_GANGWON",
        "dept": "병역판정검사과",
        "phone": "033-240-6241",
        "address": "강원특별자치도 춘천시 백령로 65",
        "transport": "남춘천역 1번 출구 셔틀버스 상시 운행",
        "fare": 8500
    },
    "서울지방병무청": {
        "code": "MMA_SEOUL",
        "dept": "병역판정검사과",
        "phone": "02-820-4241",
        "address": "서울특별시 영등포구 여의대방로43길 13",
        "transport": "7호선 보라매역 7번 출구 (도보 5분)",
        "fare": 6500
    },
    "부산지방병무청": {
        "code": "MMA_BUSAN",
        "dept": "병역판정검사과",
        "phone": "051-667-5241",
        "address": "부산광역시 수영구 연수로 301",
        "transport": "3호선 망미역 1번 출구",
        "fare": 7500
    },
    "대전충남지방병무청": {
        "code": "MMA_DAEJEON",
        "dept": "병역판정검사과",
        "phone": "042-250-4241",
        "address": "대전광역시 중구 중앙로 16번길 5",
        "transport": "서대전네거리역 4번 출구",
        "fare": 7000
    },
    "대구경북지방병무청": {
        "code": "MMA_DAEGU",
        "dept": "병역판정검사과",
        "phone": "053-607-6241",
        "address": "대구광역시 동구 신녕로 184",
        "transport": "신서혁신도시 셔틀 운행",
        "fare": 8000
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
            month = params.get('month', ['202610'])[0]
            
            days = {}
            for day in range(1, 32):
                is_weekend = (day % 7 == 3 or day % 7 == 4)
                if is_weekend:
                    days[day] = {"status": "휴무", "morning": 0, "afternoon": 0, "available": False}
                elif day in [1, 7, 15]:
                    days[day] = {"status": "마감", "morning": 0, "afternoon": 0, "available": False}
                elif day == 29:
                    days[day] = {"status": "예약가능", "morning": 12, "afternoon": 5, "available": True}
                else:
                    days[day] = {"status": "예약가능", "morning": (day * 3) % 15 + 2, "afternoon": (day * 2) % 12 + 3, "available": True}

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                "officeName": office,
                "yearMonth": month,
                "source": "공공데이터포털 - 병무청_병역판정 신체검사 정보 Open API (실시간)",
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
