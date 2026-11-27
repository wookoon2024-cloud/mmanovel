import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = r"c:\Pro1\2026상반기\mmanovel\assets\pbr"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(42)

def height_to_normal(h, strength=2.5):
    # Sobel-like gradient -> tangent-space normal map RGB
    gx = (np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)) * strength
    gy = (np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)) * strength
    nz = np.ones_like(h)
    norm = np.sqrt(gx*gx + gy*gy + nz*nz)
    r = ((-gx / norm) * 0.5 + 0.5) * 255
    g = ((-gy / norm) * 0.5 + 0.5) * 255
    b = (( nz / norm) * 0.5 + 0.5) * 255
    return Image.fromarray(np.stack([r, g, b], axis=-1).clip(0, 255).astype(np.uint8), 'RGB')

def fbm_noise(size, octaves=(8, 16, 32, 64, 128)):
    acc = np.zeros((size, size), dtype=np.float32)
    amp = 0.5
    tot = 0.0
    for f in octaves:
        grid = rng.random((f, f), dtype=np.float32)
        im = Image.fromarray((grid * 255).astype(np.uint8)).resize((size, size), Image.BICUBIC)
        acc += (np.asarray(im, dtype=np.float32) / 255.0) * amp
        tot += amp
        amp *= 0.55
    return acc / tot

# 1. Limestone cladding panels (Color + Normal)
S = 512
n = fbm_noise(S)
col = np.zeros((S, S, 3), dtype=np.float32)
h = np.ones((S, S), dtype=np.float32) * 0.85 + (n - 0.5) * 0.12
rows, cols = 8, 4
rh, cw = S // rows, S // cols
for r in range(rows):
    for c in range(cols):
        tint = (rng.random() - 0.5) * 14
        base = np.array([234 + tint, 227 + tint, 215 + tint])
        y0, y1, x0, x1 = r*rh, (r+1)*rh, c*cw, (c+1)*cw
        col[y0:y1, x0:x1] = base
        # subtle rain weathering streak at top of each panel
        for dy in range(min(10, rh)):
            col[y0+dy, x0:x1] -= (10 - dy) * 0.6
# add fine mineral speckle
col += (n[..., None] - 0.5) * 22
# mortar joints
for r in range(rows):
    col[r*rh:r*rh+2, :] *= 0.68
    h[r*rh:r*rh+2, :] = 0.2
for c in range(cols):
    col[:, c*cw:c*cw+2] *= 0.68
    h[:, c*cw:c*cw+2] = 0.2
Image.fromarray(col.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, "limestone_col.png"))
height_to_normal(h, 4.0).save(os.path.join(OUT, "limestone_nrm.png"))

# 2. Terracotta Brick (Color + Normal)
n2 = fbm_noise(S)
bcol = np.full((S, S, 3), [168, 162, 154], dtype=np.float32)
bh = np.full((S, S), 0.25, dtype=np.float32)
b_rows, b_cols = 16, 8
brh, bcw = S // b_rows, S // b_cols
pal = [(178, 102, 68), (162, 92, 62), (192, 118, 82), (148, 84, 56), (170, 98, 66)]
for r in range(b_rows):
    off = (r % 2) * (bcw // 2)
    for c in range(-1, b_cols + 1):
        p = pal[(r*5 + c*3 + 17) % len(pal)]
        x0 = max(0, c*bcw + off + 2)
        x1 = min(S, (c+1)*bcw + off - 2)
        y0, y1 = r*brh + 2, (r+1)*brh - 2
        if x1 > x0:
            bcol[y0:y1, x0:x1] = p
            bh[y0:y1, x0:x1] = 0.85
bcol += (n2[..., None] - 0.5) * 26
bh += (n2 - 0.5) * 0.15
Image.fromarray(bcol.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, "brick_col.png"))
height_to_normal(bh, 5.0).save(os.path.join(OUT, "brick_nrm.png"))

# 3. Weathered Asphalt (Color + Normal)
na = fbm_noise(S, (16, 32, 64, 128, 256))
fine = rng.random((S, S), dtype=np.float32)
acol = np.stack([76 + (na-0.5)*28 + (fine-0.5)*18,
                 80 + (na-0.5)*28 + (fine-0.5)*18,
                 86 + (na-0.5)*28 + (fine-0.5)*18], axis=-1)
Image.fromarray(acol.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, "asphalt_col.png"))
height_to_normal(na * 0.5 + fine * 0.5, 3.0).save(os.path.join(OUT, "asphalt_nrm.png"))

# 4. Natural Olive Grass (Color + Normal)
ng = fbm_noise(S, (8, 16, 32, 64, 128))
gf = rng.random((S, S), dtype=np.float32)
gcol = np.stack([96  + (ng-0.5)*42 + (gf-0.5)*18,
                 122 + (ng-0.5)*46 + (gf-0.5)*22,
                 62  + (ng-0.5)*26 + (gf-0.5)*14], axis=-1)
Image.fromarray(gcol.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, "grass_col.png"))
height_to_normal(ng * 0.4 + gf * 0.6, 3.5).save(os.path.join(OUT, "grass_nrm.png"))

# 5. Red/Ivory Checker Plaza Pavers (Color + Normal)
np2 = fbm_noise(S)
pcol = np.zeros((S, S, 3), dtype=np.float32)
ph = np.full((S, S), 0.85, dtype=np.float32)
pn = 8; ps = S // pn
for r in range(pn):
    for c in range(pn):
        base = np.array([218, 206, 194]) if (r + c) % 2 == 0 else np.array([168, 114, 100])
        pcol[r*ps:(r+1)*ps, c*ps:(c+1)*ps] = base
        pcol[r*ps:r*ps+2, :] *= 0.72; ph[r*ps:r*ps+2, :] = 0.25
        pcol[:, c*ps:c*ps+2] *= 0.72; ph[:, c*ps:c*ps+2] = 0.25
pcol += (np2[..., None] - 0.5) * 20
Image.fromarray(pcol.clip(0, 255).astype(np.uint8)).save(os.path.join(OUT, "plaza_col.png"))
height_to_normal(ph + (np2 - 0.5)*0.1, 3.5).save(os.path.join(OUT, "plaza_nrm.png"))

# 6. Curtain-Wall Interior Blind/Depth Glass Texture
wimg = Image.new('RGB', (512, 512), (24, 52, 62))
wd = ImageDraw.Draw(wimg)
# subtle horizontal blinds + bright ceiling strip + dark office depth
for y in range(0, 512, 8):
    shade = 38 + int(18 * math.sin(y * 0.04))
    wd.line([(0, y), (512, y)], fill=(shade, shade+26, shade+32), width=2)
# bright interior ceiling lights in upper third of each window pane
for wx in (64, 192, 320, 448):
    wd.rectangle([wx-36, 40, wx+36, 72], fill=(120, 165, 172))
    wd.rectangle([wx-36, 296, wx+36, 328], fill=(115, 158, 166))
wimg = wimg.filter(ImageFilter.GaussianBlur(1.5))
wimg.save(os.path.join(OUT, "window_col.png"))

# 7. Crisp Alpha Foliage Leaf Cluster Cards (Pine, Oak, Maple — NO CLAY BALLS!)
def make_leaf_card(filename, palette, needle=False):
    im = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # central woody twig
    d.line([(128, 245), (128, 45)], fill=(74, 52, 36, 255), width=5)
    for b in range(5):
        by = 210 - b * 36
        d.line([(128, by), (55 + b*6, by - 36)], fill=(74, 52, 36, 255), width=3)
        d.line([(128, by), (200 - b*6, by - 36)], fill=(74, 52, 36, 255), width=3)
    # dense individual leaves / pine needles
    for _ in range(280 if needle else 160):
        ang = random.uniform(0, math.pi * 2)
        rad = random.uniform(10, 108)
        cx = 128 + math.cos(ang) * rad * 0.92
        cy = 128 + math.sin(ang) * rad * 0.95
        c = random.choice(palette)
        if needle:
            a2 = random.uniform(0, math.pi * 2)
            l = random.uniform(14, 28)
            d.line([(cx, cy), (cx + math.cos(a2)*l, cy + math.sin(a2)*l)], fill=(*c, 255), width=3)
        else:
            rx = random.uniform(9, 18)
            ry = random.uniform(6, 13)
            d.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=(*c, 255))
    im.save(os.path.join(OUT, filename))

random.seed(7)
make_leaf_card("leaf_pine.png",  [(34,68,32), (46,84,40), (62,102,48), (82,118,56)], needle=True)
make_leaf_card("leaf_oak.png",   [(44,82,36), (62,106,46), (86,128,58), (112,146,68)], needle=False)
make_leaf_card("leaf_maple.png", [(152,44,32), (186,74,38), (214,116,44), (132,36,28)], needle=False)

# 8. Korean Building Signage PNGs (using Windows Malgun Gothic Bold)
FONT_PATH = r"C:\Windows\Fonts\malgunbd.ttf"
def make_sign(fname, w, h, bg, lines, border=None, vertical=False):
    im = Image.new('RGBA', (w, h), bg)
    d = ImageDraw.Draw(im)
    if border:
        d.rectangle([4, 4, w-5, h-5], outline=border, width=8)
    if vertical:
        text, fsize, color = lines[0]
        font = ImageFont.truetype(FONT_PATH, fsize)
        step = (h - 40) / len(text)
        for i, ch in enumerate(text):
            d.text((w//2, int(20 + step*(i+0.5))), ch, font=font, fill=color, anchor="mm")
    else:
        for text, fsize, color, y in lines:
            font = ImageFont.truetype(FONT_PATH, fsize)
            d.text((w//2, y), text, font=font, fill=color, anchor="mm")
    im.save(os.path.join(OUT, fname))

make_sign("sign_main.png", 1024, 160, (238,232,220,255), [("경 기 북 부 병 무 지 청", 80, (30,58,138,255), 82)])
make_sign("sign_annex_v.png", 160, 1024, (238,232,220,255), [("병역판정검사장", 96, (30,41,59,255))], vertical=True)
make_sign("sign_annex_east.png", 512, 320, (238,232,220,255), [("경기북부", 72, (48,58,72,255), 98), ("병 무 청", 112, (48,58,72,255), 215)])
make_sign("sign_minwon.png", 640, 120, (30,58,138,255), [("고객지원센터(민원실) | 군지원센터(면접실)", 26, (255,255,255,255), 60)], border=(255,255,255,255))
make_sign("sign_slogan.png", 1024, 240, (248,250,252,255), [("공정하고 정의로운", 42, (59,130,246,255), 74), ("병역이 자랑스러운 대한민국", 66, (15,23,42,255), 160)], border=(203,213,225,255))

print("Generated all PBR textures, alpha leaf cards, and signage in:", OUT)
