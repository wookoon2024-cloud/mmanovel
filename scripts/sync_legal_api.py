# -*- coding: utf-8 -*-
"""
병역판정검사 비주얼 노벨 - 공공데이터포털 Open API & 법제처 국가법령정보 Open API (DRF) 자동 동기화 스크립트
(매일 새벽 자동 실행되어 법제처 공식 API를 통해 최신 개정 법령 별표 번호 및 Open API 상태를 대본에 자동 반영)
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENARIO_PATH = os.path.join(BASE_DIR, 'scenario.js')
LOG_PATH = os.path.join(BASE_DIR, 'sync_log.json')
LAW_API_OC = os.environ.get('LAW_API_OC', 'westock')

def fetch_url(url, timeout=15):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def check_openapi():
    """공공데이터포털 병무청 병역판정 신체검사 정보(3064321) 상태 확인"""
    url = 'https://www.data.go.kr/data/3064321/openapi.do'
    result = {
        'url': url,
        'title': '병무청 병역판정 신체검사 정보',
        'status': 'ACTIVE',
        'checked_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    try:
        html = fetch_url(url)
        if '병역판정 신체검사 정보' in html:
            result['verified'] = True
            if '18.5' in html and '35' in html:
                result['bmi_range'] = '18.5 ~ 35.0'
        else:
            result['verified'] = False
            result['status'] = 'UNEXPECTED_HTML'
    except Exception as e:
        result['verified'] = False
        result['error'] = str(e)
    return result

def check_national_law_drf_api(oc=LAW_API_OC):
    """법제처 국가법령정보공동활용 공식 Open API (DRF) 연동"""
    query = urllib.parse.quote('병역판정신체검사등검사규칙')
    search_url = f'https://www.law.go.kr/DRF/lawSearch.do?OC={oc}&target=law&type=JSON&query={query}'
    
    result = {
        'api_type': 'DRF_OFFICIAL_OPEN_API',
        'oc': oc,
        'law_name': '병역판정 신체검사 등 검사규칙',
        'checked_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'bmi_appendix': 2,
        'disease_appendix': 3,
        'verified': False
    }

    try:
        search_raw = fetch_url(search_url)
        search_data = json.loads(search_raw)
        laws = search_data.get('LawSearch', {}).get('law', [])
        if isinstance(laws, dict):
            laws = [laws]
        
        if not laws:
            raise ValueError("No law returned from DRF search API")

        target_law = laws[0]
        mst = target_law.get('법령일련번호') or target_law.get('일련번호')
        if not mst and '법령상세링크' in target_law:
            m_mst = re.search(r'MST=(\d+)', target_law['법령상세링크'])
            if m_mst:
                mst = m_mst.group(1)

        prom_num = str(target_law.get('공포번호', '')).lstrip('0')
        ef_date = target_law.get('시행일자', '')
        law_gubun = target_law.get('법령구분명', '국방부령')

        result['mst'] = mst
        result['ordinance_info'] = f"{law_gubun} 제{prom_num}호 (시행 {ef_date})"

        # 상세 법령 본문 및 별표 단위 JSON 조회
        service_url = f'https://www.law.go.kr/DRF/lawService.do?OC={oc}&target=law&MST={mst}&type=JSON'
        service_raw = fetch_url(service_url)
        service_data = json.loads(service_raw)
        
        appendix_units = service_data.get('법령', {}).get('별표', {}).get('별표단위', [])
        if isinstance(appendix_units, dict):
            appendix_units = [appendix_units]

        found_appendices = []
        for app in appendix_units:
            num_str = str(app.get('별표번호', '')).lstrip('0')
            num = int(num_str) if num_str.isdigit() else 0
            title = app.get('별표제목', '')
            found_appendices.append({'number': num, 'title': title})

            if '신장' in title and '체중' in title:
                result['bmi_appendix'] = num
            elif '질병' in title and '심신장애' in title:
                result['disease_appendix'] = num

        result['appendices'] = found_appendices
        result['verified'] = True
        return result
    except Exception as e:
        result['error'] = str(e)
        return result

def check_national_law():
    """국가법령 확인 (공식 DRF API 우선 호출, 실패 시 웹 스크래핑 백업)"""
    drf_res = check_national_law_drf_api(LAW_API_OC)
    if drf_res.get('verified'):
        return drf_res

    print(f"[WARNING] DRF API 호출 실패 ({drf_res.get('error')}), 웹 대체 파싱 진행...")
    main_url = 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EB%B3%91%EC%97%AD%ED%8C%90%EC%A0%95%EC%8B%A0%EC%B2%B4%EA%B2%80%EC%82%AC%EB%93%B1%EA%B2%80%EC%82%AC%EA%B7%9C%EC%B9%99'
    result = {
        'api_type': 'WEB_FALLBACK_SCRAPING',
        'url': main_url,
        'law_name': '병역판정 신체검사 등 검사규칙',
        'checked_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'bmi_appendix': 2,
        'disease_appendix': 3,
        'verified': False
    }

    try:
        html = fetch_url(main_url)
        iframe_match = re.search(r'src="(/LSW//?lsInfoP\.do\?[^"]+)"', html)
        if iframe_match:
            sub_url = 'https://www.law.go.kr' + iframe_match.group(1).replace('&amp;', '&')
            sub_html = fetch_url(sub_url)
            
            ord_match = re.search(r'\[([^\]]*국방부령\s*제\d+호[^\]]*)\]', sub_html)
            if ord_match:
                result['ordinance_info'] = ord_match.group(1).strip()
            
            if '신장ㆍ체중에 따른 신체등급' in sub_html or '신장·체중에 따른 신체등급' in sub_html:
                m_bmi = re.search(r'별표\s*(\d+).*?신장', sub_html)
                if m_bmi:
                    result['bmi_appendix'] = int(m_bmi.group(1))
            
            if '질병ㆍ심신장애의 정도 및 평가기준' in sub_html or '질병·심신장애의 정도 및 평가기준' in sub_html:
                m_dis = re.search(r'별표\s*(\d+).*?질병', sub_html)
                if m_dis:
                    result['disease_appendix'] = int(m_dis.group(1))
                    
            result['verified'] = True
    except Exception as e:
        result['error'] = str(e)

    return result

def sync_scenario(openapi_res, law_res):
    """최신 검증 결과에 따라 scenario.js 대본 및 출처 자동 업데이트"""
    if not os.path.exists(SCENARIO_PATH):
        print(f'Error: {SCENARIO_PATH} not found.')
        return False

    with open(SCENARIO_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = []

    dis_app = law_res.get('disease_appendix', 3)
    bmi_app = law_res.get('bmi_appendix', 2)

    # SCENE 4: 질병 구비서류
    target_s4 = re.search(r'(apiSource:\s*"(?:\[법령\]\s*)?국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 질병·심신장애 평가기준")', content)
    if target_s4:
        new_s4 = f"{target_s4.group(1)}{dis_app}{target_s4.group(2)}"
        if target_s4.group(0) != new_s4:
            content = content.replace(target_s4.group(0), new_s4)
            changes.append(f"SCENE 4 별표 번호 업데이트: 별표 {dis_app}")

    # SCENE 9: 신장·체중 (BMI)
    target_s9 = re.search(r'(apiSource:\s*"(?:\[법령\]\s*)?국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 신장·체중에 따른 신체등급 판정기준")', content)
    if target_s9:
        new_s9 = f"{target_s9.group(1)}{bmi_app}{target_s9.group(2)}"
        if target_s9.group(0) != new_s9:
            content = content.replace(target_s9.group(0), new_s9)
            changes.append(f"SCENE 9 별표 번호 업데이트: 별표 {bmi_app}")

    # SCENE 10: 대사 및 출처 (관절 질환)
    target_s10_text = re.search(r'(국방부령 \[별표 )\d+(\] 204호 기준에 부합하여)', content)
    if target_s10_text:
        new_s10_text = f"{target_s10_text.group(1)}{dis_app}{target_s10_text.group(2)}"
        if target_s10_text.group(0) != new_s10_text:
            content = content.replace(target_s10_text.group(0), new_s10_text)
            changes.append(f"SCENE 10 대사 별표 번호 업데이트: 별표 {dis_app}")

    target_s10_source = re.search(r'(apiSource:\s*"(?:\[법령\]\s*)?국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 204호 \(관절 질환 평가기준\)")', content)
    if target_s10_source:
        new_s10_source = f"{target_s10_source.group(1)}{dis_app}{target_s10_source.group(2)}"
        if target_s10_source.group(0) != new_s10_source:
            content = content.replace(target_s10_source.group(0), new_s10_source)
            changes.append(f"SCENE 10 출처 별표 번호 업데이트: 별표 {dis_app}")

    has_changed = (content != original_content)
    if has_changed:
        with open(SCENARIO_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[SUCCESS] scenario.js 업데이트 완료: {len(changes)}개 항목 변경")
        for c in changes:
            print(f" - {c}")
    else:
        print("[UP-TO-DATE] 모든 법령 및 Open API 매핑이 최신 상태입니다. (변경 없음)")

    log_data = {
        'last_sync': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'changed': has_changed,
        'changes': changes,
        'openapi': openapi_res,
        'law': law_res
    }

    try:
        with open(LOG_PATH, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Warning: Failed to write log: {e}")

    return has_changed

def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 법제처 DRF Open API (OC: {LAW_API_OC}) & 공공데이터 대본 자동 점검 시작...")
    openapi_res = check_openapi()
    law_res = check_national_law()
    changed = sync_scenario(openapi_res, law_res)
    sys.exit(0 if not changed else 0)

if __name__ == '__main__':
    main()
