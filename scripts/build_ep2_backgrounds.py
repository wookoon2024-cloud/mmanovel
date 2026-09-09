import urllib.request
import urllib.parse
import json
import os
import cv2
import numpy as np

import time

os.makedirs('assets', exist_ok=True)

HEADERS = {'User-Agent': 'MMANovelGame/1.0 (contact: wookoon@gmail.com; educational simulation)'}

def search_wikimedia(query, limit=5):
    time.sleep(1.5)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=filetype:bitmap+{urllib.parse.quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            results = []
            pages = data.get('query', {}).get('pages', {})
            for page_id, page_info in pages.items():
                infos = page_info.get('imageinfo', [])
                if infos:
                    img_url = infos[0].get('url')
                    width = infos[0].get('width', 0)
                    height = infos[0].get('height', 0)
                    if img_url and width >= 1000 and height >= 600:
                        results.append((img_url, width, height))
            return results
    except Exception as e:
        print(f"Search failed for '{query}': {e}")
        return []

def anime_stylize(in_path, out_path, target_w=1280, target_h=720, warmth=10):
    img = cv2.imread(in_path)
    if img is None:
        return False
    h, w = img.shape[:2]
    # Crop to 16:9
    if w / h > 16 / 9:
        new_w = int(h * 16 / 9)
        start_x = (w - new_w) // 2
        img = img[:, start_x:start_x+new_w]
    else:
        new_h = int(w * 9 / 16)
        start_y = (h - new_h) // 2
        img = img[start_y:start_y+new_h, :]
    img = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_AREA)

    # Cel-shading / Bilateral filter
    color = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)
    color = cv2.bilateralFilter(color, d=7, sigmaColor=50, sigmaSpace=50)

    # Subtle edges
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 3)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 3)
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    # Blend
    anime = cv2.bitwise_and(color, edges_color)

    # Color boost & warmth
    hsv = cv2.cvtColor(anime, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.2, 0, 255) # Saturation boost
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.05 + warmth, 0, 255) # Value/Brightness
    anime = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    cv2.imwrite(out_path, anime, [cv2.IMWRITE_JPEG_QUALITY, 92])
    return True

SEARCH_TARGETS = {
    "assets/ep2_camp_gate.jpg": "military gate entrance",
    "assets/ep2_auditorium.jpg": "lecture hall auditorium screen",
    "assets/ep2_shooting_range.jpg": "shooting range target",
    "assets/ep2_miles_urban.jpg": "urban training facility military",
    "assets/ep2_cpr_lab.jpg": "CPR training medical",
    "assets/ep2_px_mart.jpg": "convenience store shelves",
    "assets/ep2_bus_sunset.jpg": "bus window sunset"
}

for out_file, search_term in SEARCH_TARGETS.items():
    if os.path.exists(out_file):
        print(f"Skipping {out_file} (already exists)")
        continue
    print(f"Searching for {out_file}: '{search_term}'...")
    candidates = search_wikimedia(search_term, limit=6)
    if not candidates:
        broader = search_term.split()[0]
        print(f"Trying broader: '{broader}'...")
        candidates = search_wikimedia(broader, limit=6)
    
    downloaded = False
    for url, w, h in candidates:
        tmp_file = "assets/temp_" + os.path.basename(out_file)
        try:
            time.sleep(2)
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as r, open(tmp_file, 'wb') as f:
                f.write(r.read())
            if anime_stylize(tmp_file, out_file):
                print(f"Successfully created {out_file} from {url}")
                downloaded = True
                if os.path.exists(tmp_file):
                    os.remove(tmp_file)
                break
        except Exception as e:
            print(f"Error processing candidate: {e}")
            if os.path.exists(tmp_file):
                os.remove(tmp_file)

    if not downloaded:
        print(f"WARNING: Could not download candidate for {out_file}")
