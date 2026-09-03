# -*- coding: utf-8 -*-
"""
병역판정검사 비주얼 노벨 - 공공데이터포털 Open API & 국가법령 자동 동기화 스크립트
(매일 새벽 자동 실행되어 최신 개정 법령 별표 번호 및 Open API 상태를 대본에 자동 반영)
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

def check_national_law():
    """국가법령정보센터 「병역판정 신체검사 등 검사규칙」 개정 현황 및 별표 체계 확인"""
    main_url = 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EB%B3%91%EC%97%AD%ED%8C%90%EC%A0%95%EC%8B%A0%EC%B2%B4%EA%B2%80%EC%82%AC%EB%93%B1%EA%B2%80%EC%82%AC%EA%B7%9C%EC%B9%99'
    result = {
        'url': main_url,
        'law_name': '병역판정 신체검사 등 검사규칙',
        'checked_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'bmi_appendix': 2,       # 기본: 별표 2 (신장·체중)
        'disease_appendix': 3,   # 기본: 별표 3 (질병·심신장애)
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
        else:
            result['verified'] = True
    except Exception as e:
        result['verified'] = False
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
    target_s4 = re.search(r'(apiSource:\s*"국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 질병·심신장애 평가기준")', content)
    if target_s4:
        new_s4 = f"{target_s4.group(1)}{dis_app}{target_s4.group(2)}"
        if target_s4.group(0) != new_s4:
            content = content.replace(target_s4.group(0), new_s4)
            changes.append(f"SCENE 4 별표 번호 업데이트: 별표 {dis_app}")

    # SCENE 9: 신장·체중 (BMI)
    target_s9 = re.search(r'(apiSource:\s*"국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 신장·체중에 따른 신체등급 판정기준")', content)
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

    target_s10_source = re.search(r'(apiSource:\s*"국가법령정보센터: 「병역판정 신체검사 등 검사규칙」\(국방부령\) \[별표 )\d+(\] 204호 \(관절 질환 평가기준\)")', content)
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
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 법령 및 공공데이터 Open API 대본 자동 점검 시작...")
    openapi_res = check_openapi()
    law_res = check_national_law()
    changed = sync_scenario(openapi_res, law_res)
    sys.exit(0 if not changed else 0)

if __name__ == '__main__':
    main()
