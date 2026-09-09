import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math
import os

os.makedirs('assets', exist_ok=True)

# 1. Base Hero: assets/ep2_hero_uniform.png
base_hero = Image.open('assets/ep2_hero_uniform.png').convert('RGBA')

def create_hero_nervous():
    img = base_hero.copy()
    draw = ImageDraw.Draw(img)
    # Draw classic anime sweat drops & worry lines near temple/forehead
    # Eye & forehead region approx y: 150 to 350, x: 300 to 500
    # Sweat drop 1
    drop_x, drop_y = 330, 200
    draw.polygon([(drop_x, drop_y-25), (drop_x-12, drop_y+5), (drop_x+12, drop_y+5)], fill=(130, 210, 255, 230))
    draw.ellipse((drop_x-12, drop_y-5, drop_x+12, drop_y+18), fill=(130, 210, 255, 230))
    draw.ellipse((drop_x-6, drop_y-2, drop_x-1, drop_y+6), fill=(255, 255, 255, 240)) # Highlight

    # Sweat drop 2
    drop2_x, drop2_y = 480, 240
    draw.polygon([(drop2_x, drop2_y-20), (drop2_x-9, drop2_y+4), (drop2_x+9, drop2_y+4)], fill=(130, 210, 255, 220))
    draw.ellipse((drop2_x-9, drop2_y-4, drop2_x+9, drop2_y+14), fill=(130, 210, 255, 220))
    draw.ellipse((drop2_x-5, drop2_y-1, drop2_x-1, drop2_y+5), fill=(255, 255, 255, 240))

    # Anxious wavy shadow lines on upper face (blue/purple tint)
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    draw_ov.rectangle([340, 160, 470, 260], fill=(40, 60, 140, 60))
    # Vertical stress hatch lines
    for lx in range(350, 460, 15):
        draw_ov.line([(lx, 165), (lx - 5, 240)], fill=(20, 30, 90, 140), width=3)

    img = Image.alpha_composite(img, overlay)
    img.save('assets/ep2_hero_nervous.png')
    print('assets/ep2_hero_nervous.png created')

def create_hero_confident():
    img = base_hero.copy()
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.15)
    enhancer_b = ImageEnhance.Brightness(img)
    img = enhancer_b.enhance(1.05)

    # Add confident eye glints / sparkles
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Sparkle near eyes / shoulder
    def draw_star(cx, cy, r, color):
        points = []
        for i in range(8):
            angle = i * math.pi / 4
            d = r if i % 2 == 0 else r * 0.35
            points.append((cx + d * math.cos(angle), cy + d * math.sin(angle)))
        draw.polygon(points, fill=color)

    draw_star(450, 250, 18, (255, 255, 200, 240))
    draw_star(360, 260, 12, (255, 255, 255, 220))
    draw_star(280, 450, 15, (255, 220, 120, 200)) # Golden badge glint

    img = Image.alpha_composite(img, overlay)
    img.save('assets/ep2_hero_confident.png')
    print('assets/ep2_hero_confident.png created')

def create_hero_happy():
    img = base_hero.copy()
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.2)
    enhancer_b = ImageEnhance.Brightness(img)
    img = enhancer_b.enhance(1.08)

    # Cheerful blush & sparkles
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Cheeks blush
    draw.ellipse((350, 280, 390, 305), fill=(255, 120, 140, 90))
    draw.ellipse((420, 280, 460, 305), fill=(255, 120, 140, 90))

    # Happy celebration stars
    def draw_star(cx, cy, r, color):
        points = []
        for i in range(8):
            angle = i * math.pi / 4
            d = r if i % 2 == 0 else r * 0.4
            points.append((cx + d * math.cos(angle), cy + d * math.sin(angle)))
        draw.polygon(points, fill=color)

    draw_star(310, 180, 22, (255, 230, 80, 230))
    draw_star(500, 200, 25, (255, 240, 100, 240))
    draw_star(300, 360, 16, (255, 180, 220, 220))

    img = Image.alpha_composite(img, overlay)
    img.save('assets/ep2_hero_happy.png')
    print('assets/ep2_hero_happy.png created')

# 2. Donghyun (Comrade Reservist & PX Fanatic)
# Let's derive from a young soldier portrait with unique hue and expressive features
def create_donghyun():
    # We can use base_hero with slight horizontal flip and warmer hue / hairstyle tint
    dh_base = base_hero.transpose(Image.FLIP_LEFT_RIGHT)
    arr = np.array(dh_base).astype(np.float32)
    # Adjust skin/uniform tone (more casual warm tone)
    arr[:, :, 0] = np.clip(arr[:, :, 0] * 1.05 + 10, 0, 255) # R
    arr[:, :, 1] = np.clip(arr[:, :, 1] * 1.02, 0, 255) # G
    arr[:, :, 2] = np.clip(arr[:, :, 2] * 0.95, 0, 255) # B
    dh_img = Image.fromarray(arr.astype(np.uint8))

    # Donghyun Smile
    overlay_smile = Image.new('RGBA', dh_img.size, (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(overlay_smile)
    # Smile lines
    draw_s.arc((360, 290, 440, 330), start=10, end=170, fill=(180, 70, 50, 200), width=4)
    dh_smile = Image.alpha_composite(dh_img, overlay_smile)
    dh_smile.save('assets/ep2_donghyun_smile.png')
    print('assets/ep2_donghyun_smile.png created')

    # Donghyun Excited (PX fanatic - huge sparkle eyes & shopping thrill)
    dh_exc = dh_img.copy()
    overlay_exc = Image.new('RGBA', dh_exc.size, (0, 0, 0, 0))
    draw_e = ImageDraw.Draw(overlay_exc)
    # Starry excitement eyes!
    def draw_star(cx, cy, r, color):
        points = []
        for i in range(8):
            angle = i * math.pi / 4
            d = r if i % 2 == 0 else r * 0.35
            points.append((cx + d * math.cos(angle), cy + d * math.sin(angle)))
        draw_e.polygon(points, fill=color)

    # In eyes
    draw_star(370, 260, 16, (255, 230, 50, 255))
    draw_star(435, 260, 16, (255, 230, 50, 255))
    # PX shopping excitement icons / sparkles
    draw_star(270, 220, 22, (255, 215, 0, 230))
    draw_star(530, 240, 24, (255, 105, 180, 230))
    draw_star(500, 350, 18, (135, 206, 250, 220))

    dh_exc = Image.alpha_composite(dh_exc, overlay_exc)
    dh_exc.save('assets/ep2_donghyun_excited.png')
    print('assets/ep2_donghyun_excited.png created')

# 3. Instructor Salute (Smiling Commander)
def create_instructor_salute():
    inst = Image.open('assets/ep2_instructor_strict.png').convert('RGBA')
    enhancer_c = ImageEnhance.Color(inst)
    inst = enhancer_c.enhance(1.1)
    enhancer_b = ImageEnhance.Brightness(inst)
    inst = enhancer_b.enhance(1.06)

    overlay = Image.new('RGBA', inst.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Gold commander star on chest/collar
    def draw_star(cx, cy, r, color):
        points = []
        for i in range(8):
            angle = i * math.pi / 4
            d = r if i % 2 == 0 else r * 0.4
            points.append((cx + d * math.cos(angle), cy + d * math.sin(angle)))
        draw.polygon(points, fill=color)

    draw_star(480, 480, 20, (255, 215, 0, 250)) # Golden star badge
    draw_star(320, 480, 20, (255, 215, 0, 250))
    # Confident smile curve
    draw.arc((375, 290, 435, 325), start=15, end=165, fill=(160, 50, 40, 220), width=4)

    inst = Image.alpha_composite(inst, overlay)
    inst.save('assets/ep2_instructor_salute.png')
    print('assets/ep2_instructor_salute.png created')

# 4. Assistant Private (Polite Young Private)
def create_assistant_private():
    # Use base hero scaled slightly down with friendly blue name tag and gear box
    priv = base_hero.copy()
    overlay = Image.new('RGBA', priv.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Name tag '이일병' on left chest
    draw.rectangle([440, 420, 530, 450], fill=(20, 40, 30, 230), outline=(255, 255, 255, 180), width=2)
    # Draw rank lines (one bar for Private First Class)
    draw.line([(455, 435), (515, 435)], fill=(255, 255, 255, 240), width=4)
    # Friendly smile
    draw.arc((370, 285, 430, 320), start=20, end=160, fill=(150, 60, 50, 210), width=3)

    priv = Image.alpha_composite(priv, overlay)
    priv.save('assets/ep2_assistant_polite.png')
    print('assets/ep2_assistant_polite.png created')

# 5. CPR Instructor (Medical Instructor with Red Cross Armband)
def create_cpr_instructor():
    doc = Image.open('assets/ep2_instructor_strict.png').convert('RGBA')
    overlay = Image.new('RGBA', doc.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Red Cross Medical Armband on left arm (approx x: 530, y: 500)
    draw.rectangle([510, 480, 610, 560], fill=(240, 240, 245, 240), outline=(200, 20, 20, 220), width=3)
    # Red Cross emblem
    cx, cy = 560, 520
    draw.rectangle([cx-8, cy-25, cx+8, cy+25], fill=(220, 20, 20, 255))
    draw.rectangle([cx-25, cy-8, cx+25, cy+8], fill=(220, 20, 20, 255))

    doc = Image.alpha_composite(doc, overlay)
    doc.save('assets/ep2_cpr_instructor.png')
    print('assets/ep2_cpr_instructor.png created')

create_hero_nervous()
create_hero_confident()
create_hero_happy()
create_donghyun()
create_instructor_salute()
create_assistant_private()
create_cpr_instructor()
print('ALL EPISODE 2 CHARACTER SPRITES GENERATED SUCCESSFULLY!')
