import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math
import os

os.makedirs('assets', exist_ok=True)

hero_uni = Image.open('assets/ep2_hero_uniform.png').convert('RGBA')
asst = Image.open('assets/assistant_adjudicator.png').convert('RGBA')

def make_instructor(strict=True):
    base = hero_uni.copy()
    
    # 1. Isolate asst head cleanly
    mask = Image.new('L', (800, 1200), 0)
    draw_m = ImageDraw.Draw(mask)
    polygon = [
        (380, 480), (455, 485), (480, 520), (480, 560), (465, 580), 
        (430, 600), (430, 622), (370, 622), (370, 600), (335, 580), 
        (320, 560), (320, 520), (350, 485)
    ]
    draw_m.polygon(polygon, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.5))
    
    # In base (hero_uni), remove old beret behind hair on left:
    base_arr = np.array(base)
    for y in range(470, 580):
        for x in range(300, 350):
            if x < 330:
                base_arr[y, x, 3] = 0
    base = Image.fromarray(base_arr)
    
    # Prepare asst face
    asst_face = asst.copy()
    
    if strict:
        draw_f = ImageDraw.Draw(asst_face)
        draw_f.arc((385, 558, 420, 572), start=180, end=360, fill=(150, 50, 40, 240), width=3)
        draw_f.line([(387, 563), (418, 563)], fill=(120, 40, 30, 255), width=3)
        draw_f.line([(355, 518), (385, 523)], fill=(40, 30, 25, 230), width=4)
        draw_f.line([(420, 523), (450, 518)], fill=(40, 30, 25, 230), width=4)
    else:
        draw_f = ImageDraw.Draw(asst_face)
        draw_f.arc((385, 555, 420, 575), start=15, end=165, fill=(160, 45, 35, 240), width=4)
        
    asst_alpha = asst.split()[3]
    comb_mask = Image.new('L', (800, 1200), 0)
    comb_mask.paste(mask, (0, 0), asst_alpha)
    
    inst = base.copy()
    inst.paste(asst_face, (0, 0), comb_mask)
    
    draw_i = ImageDraw.Draw(inst)
    
    # Left chest tag: 교 관
    draw_i.rectangle([425, 765, 500, 790], fill=(25, 45, 30, 255), outline=(15, 30, 20, 255), width=1)
    draw_i.line([(440, 777), (460, 777)], fill=(240, 240, 220, 240), width=3)
    draw_i.line([(450, 772), (450, 783)], fill=(240, 240, 220, 240), width=3)
    draw_i.line([(470, 777), (490, 777)], fill=(240, 240, 220, 240), width=3)
    draw_i.line([(480, 772), (480, 783)], fill=(240, 240, 220, 240), width=3)
    
    # Right chest tag: 최 진 우
    draw_i.rectangle([290, 765, 365, 790], fill=(25, 45, 30, 255), outline=(15, 30, 20, 255), width=1)
    draw_i.line([(305, 777), (350, 777)], fill=(240, 240, 220, 240), width=3)
    
    # Remove 예비군 arm tag on left arm
    draw_i.rectangle([520, 800, 580, 835], fill=(45, 60, 40, 255))
    
    # Red Instructor Armband on right arm (viewer left: x: 215 to 275, y: 775 to 855)
    draw_i.rectangle([215, 775, 275, 855], fill=(210, 25, 25, 245), outline=(255, 215, 0, 255), width=3)
    draw_i.line([(225, 815), (265, 815)], fill=(255, 240, 150, 255), width=4)
    draw_i.line([(245, 795), (245, 835)], fill=(255, 240, 150, 255), width=4)
    
    # Master Sergeant collar rank (상사 계급장 - 3 chevrons + arc)
    for cx in [350, 445]:
        draw_i.rectangle([cx-10, 680, cx+10, 700], fill=(15, 30, 20, 240))
        draw_i.line([(cx-7, 688), (cx, 683), (cx+7, 688)], fill=(255, 215, 0, 255), width=2)
        draw_i.line([(cx-7, 692), (cx, 687), (cx+7, 692)], fill=(255, 215, 0, 255), width=2)
        draw_i.line([(cx-7, 696), (cx, 691), (cx+7, 696)], fill=(255, 215, 0, 255), width=2)
        draw_i.arc((cx-8, 694, cx+8, 702), start=10, end=170, fill=(255, 215, 0, 255), width=2)

    if not strict:
        draw_i.polygon([(460, 720), (470, 705), (480, 720), (495, 725), (483, 737), (487, 752), (470, 742), (453, 752), (457, 737), (445, 725)], fill=(255, 215, 0, 250), outline=(255, 255, 200, 255))
        
    return inst

inst_strict = make_instructor(strict=True)
inst_strict.save('assets/ep2_instructor_strict.png')
print('assets/ep2_instructor_strict.png created')

inst_salute = make_instructor(strict=False)
inst_salute.save('assets/ep2_instructor_salute.png')
print('assets/ep2_instructor_salute.png created')

def make_cpr_instructor():
    inst = make_instructor(strict=False)
    draw = ImageDraw.Draw(inst)
    draw.rectangle([520, 775, 580, 855], fill=(250, 250, 255, 250), outline=(220, 20, 20, 255), width=3)
    draw.rectangle([545, 790, 555, 840], fill=(220, 20, 20, 255))
    draw.rectangle([530, 810, 570, 820], fill=(220, 20, 20, 255))
    inst.save('assets/ep2_cpr_instructor.png')
    print('assets/ep2_cpr_instructor.png created')

make_cpr_instructor()

def make_donghyun():
    dh_base = hero_uni.transpose(Image.FLIP_LEFT_RIGHT)
    arr = np.array(dh_base).astype(np.float32)
    arr[:, :, 0] = np.clip(arr[:, :, 0] * 1.04 + 8, 0, 255)
    arr[:, :, 1] = np.clip(arr[:, :, 1] * 1.01, 0, 255)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * 0.96, 0, 255)
    dh_img = Image.fromarray(arr.astype(np.uint8))
    
    # Smile
    dh_smile = dh_img.copy()
    draw_s = ImageDraw.Draw(dh_smile)
    draw_s.arc((365, 605, 435, 635), start=15, end=165, fill=(170, 50, 40, 230), width=4)
    draw_s.rectangle([435, 765, 510, 790], fill=(25, 45, 30, 255))
    draw_s.line([(450, 777), (495, 777)], fill=(240, 240, 220, 240), width=3)
    dh_smile.save('assets/ep2_donghyun_smile.png')
    print('assets/ep2_donghyun_smile.png created')
    
    # Excited
    dh_exc = dh_img.copy()
    overlay = Image.new('RGBA', dh_exc.size, (0, 0, 0, 0))
    draw_e = ImageDraw.Draw(overlay)
    def draw_star(cx, cy, r, color):
        points = []
        for i in range(8):
            angle = i * math.pi / 4
            d = r if i % 2 == 0 else r * 0.35
            points.append((cx + d * math.cos(angle), cy + d * math.sin(angle)))
        draw_e.polygon(points, fill=color)
        
    draw_star(380, 560, 14, (255, 230, 50, 255))
    draw_star(425, 560, 14, (255, 230, 50, 255))
    draw_star(280, 520, 20, (255, 215, 0, 230))
    draw_star(520, 530, 22, (255, 105, 180, 230))
    draw_e.arc((360, 600, 440, 640), start=10, end=170, fill=(180, 40, 30, 255), width=5)
    
    dh_exc = Image.alpha_composite(dh_exc, overlay)
    dh_exc.save('assets/ep2_donghyun_excited.png')
    print('assets/ep2_donghyun_excited.png created')

make_donghyun()
print('ALL CAST SPRITES BUILT!')
