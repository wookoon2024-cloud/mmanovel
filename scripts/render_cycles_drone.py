import bpy
import bmesh
import math
import os
import random
from mathutils import Vector, Matrix, Euler

# =============================================================================
# 경기북부병무지청 Blender 5.3 Cycles 광추적 실사 드론 사진 렌더러 v1.0
# - mma_bukbu_blender.glb(DXF 1:1,000 실측) 임포트 + Cycles 실사 쉐이더 업그레이드
# - Nishita 물리 대기 하늘 + AgX 시네마틱 톤매핑 + OpenImageDenoise
# - 주변 의정부 호원동 아파트/상가/가로등/도봉산 원경 산지 360° 배경 구축
# - 출력: render_drone_hero.png, render_drone_south.png (1920x1080)
# =============================================================================

BASE_DIR = r"c:\Pro1\2026상반기\mmanovel"
IN_GLB   = os.path.join(BASE_DIR, "mma_bukbu_blender.glb")
OUT_HERO = os.path.join(BASE_DIR, "render_drone_hero.png")
OUT_SOUTH = os.path.join(BASE_DIR, "render_drone_south.png")

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def t2b(x, y, z):
    """Three.js (x, y_up, z_south) -> Blender (x, -z_south, y_up)"""
    return Vector((x, -z, y))

# 1. 기존 정밀 GLB 모델 임포트
bpy.ops.import_scene.gltf(filepath=IN_GLB)

# 2. Cycles 광추적 엔진 + AgX 컬러매니지먼트 설정
scene.render.engine = 'CYCLES'
scene.cycles.use_denoising = True
if hasattr(scene.cycles, "denoiser"):
    scene.cycles.denoiser = 'OPENIMAGEDENOISE'
if hasattr(scene.cycles, "denoising_input_passes"):
    scene.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.03
scene.cycles.samples = 48
scene.cycles.max_bounces = 8
scene.cycles.diffuse_bounces = 3
scene.cycles.glossy_bounces = 4
scene.cycles.transmission_bounces = 4
scene.cycles.transparent_max_bounces = 12

# GPU 사용 가능 시 자동 활성화, 없으면 CPU
prefs = bpy.context.preferences.addons.get('cycles')
device_used = 'CPU'
if prefs:
    cprefs = prefs.preferences
    for backend in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI'):
        try:
            cprefs.compute_device_type = backend
            cprefs.get_devices()
            devs = [d for d in cprefs.devices if d.type == backend]
            if devs:
                for d in cprefs.devices:
                    d.use = (d.type == backend)
                scene.cycles.device = 'GPU'
                device_used = f'GPU({backend})'
                scene.cycles.samples = 128
                break
        except Exception:
            pass
if device_used == 'CPU':
    scene.cycles.device = 'CPU'
print("CYCLES DEVICE:", device_used, "SAMPLES:", scene.cycles.samples)

# AgX 영화급 색보정
try:
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    scene.view_settings.view_transform = 'Filmic'
scene.view_settings.exposure = -0.35
scene.view_settings.gamma = 1.0

# 3. Nishita 물리 대기 하늘 (실사 골든아워 태양 + 레일리/미 산란 + 오존)
world = bpy.data.worlds.new("RealSkyWorld")
scene.world = world
if world.node_tree is None:
    world.use_nodes = True
wnt = world.node_tree
wnt.nodes.clear()
w_out = wnt.nodes.new("ShaderNodeOutputWorld")
w_bg  = wnt.nodes.new("ShaderNodeBackground")
w_sky = wnt.nodes.new("ShaderNodeTexSky")
for st in ('MULTIPLE_SCATTERING', 'SINGLE_SCATTERING', 'NISHITA', 'HOSEK_WILKIE'):
    try:
        w_sky.sky_type = st
        break
    except Exception:
        pass
for attr, val in [
    ("sun_disc", True),
    ("sun_size", math.radians(0.65)),
    ("sun_intensity", 1.15),
    ("sun_elevation", math.radians(24.0)),
    ("sun_rotation", math.radians(128.0)),
    ("altitude", 120.0),
    ("air_density", 1.15),
    ("dust_density", 1.35),
    ("ozone_density", 1.4),
]:
    if hasattr(w_sky, attr):
        setattr(w_sky, attr, val)
w_bg.inputs["Strength"].default_value = 0.65
wnt.links.new(w_sky.outputs["Color"], w_bg.inputs["Color"])
wnt.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])

# 4. Cycles 전용 실사 쉐이더 업그레이드 (AO 구석 음영 + 나뭇잎 반투명 + 아스팔트 거칠기 변화)
def enhance_cycles_materials():
    for mat in bpy.data.materials:
        if not mat.node_tree:
            continue
        nt = mat.node_tree
        bsdf = None
        for n in nt.nodes:
            if n.type == 'BSDF_PRINCIPLED':
                bsdf = n
                break
        if not bsdf:
            continue

        mname = mat.name

        # A) 나뭇잎: 알파 컷아웃 + 태양광 반투명(Translucent) 혼합 -> 실제 나무처럼 빛 투과!
        if mname.startswith("Leaf_"):
            bsdf.inputs["Roughness"].default_value = 0.62
            if "Subsurface Weight" in bsdf.inputs:
                bsdf.inputs["Subsurface Weight"].default_value = 0.25
            if "Subsurface Scale" in bsdf.inputs:
                bsdf.inputs["Subsurface Scale"].default_value = 0.08
            continue

        # B) 유리창: 선명한 하늘/구름 반사
        if "Window" in mname or mname == "Glass":
            bsdf.inputs["Roughness"].default_value = 0.04
            bsdf.inputs["Metallic"].default_value = 0.12
            if "IOR" in bsdf.inputs:
                bsdf.inputs["IOR"].default_value = 1.52
            if "Coat Weight" in bsdf.inputs:
                bsdf.inputs["Coat Weight"].default_value = 1.0
            continue

        # C) 석재 · 적벽돌 · 아스팔트 · 광장 · 옹벽: Cycles 물리 Ambient Occlusion 노드 삽입!
        if any(k in mname for k in ("Limestone", "Terracotta", "Asphalt", "Plaza", "Retain", "Coping", "Grass")):
            base_in = bsdf.inputs["Base Color"]
            ao = nt.nodes.new("ShaderNodeAmbientOcclusion")
            ao.samples = 8
            ao.inputs["Distance"].default_value = 2.6 if "Asphalt" not in mname else 3.5

            # AO 대비 강화 (Power 1.45)
            gamma_ao = nt.nodes.new("ShaderNodeGamma")
            gamma_ao.inputs["Gamma"].default_value = 1.45
            nt.links.new(ao.outputs["AO"], gamma_ao.inputs["Color"])

            mix = nt.nodes.new("ShaderNodeMix")
            mix.data_type = 'RGBA'
            mix.blend_type = 'MULTIPLY'
            mix.inputs["Factor"].default_value = 0.62

            if base_in.is_linked:
                orig_sock = base_in.links[0].from_socket
                nt.links.remove(base_in.links[0])
                nt.links.new(orig_sock, mix.inputs[6])  # A
            else:
                mix.inputs[6].default_value = tuple(base_in.default_value)

            nt.links.new(gamma_ao.outputs["Color"], mix.inputs[7])  # B
            nt.links.new(mix.outputs[2], base_in)

        # D) 아스팔트: 절차적 노이즈로 도로 거칠기 변주 (햇빛 반사 질감!)
        if "Asphalt" in mname:
            tex_coord = nt.nodes.new("ShaderNodeTexCoord")
            noise = nt.nodes.new("ShaderNodeTexNoise")
            noise.inputs["Scale"].default_value = 0.18
            noise.inputs["Detail"].default_value = 6.0
            ramp = nt.nodes.new("ShaderNodeValToRGB")
            ramp.color_ramp.elements[0].position = 0.30
            ramp.color_ramp.elements[0].color = (0.48, 0.48, 0.48, 1.0)
            ramp.color_ramp.elements[1].position = 0.72
            ramp.color_ramp.elements[1].color = (0.88, 0.88, 0.88, 1.0)
            nt.links.new(tex_coord.outputs["Object"], noise.inputs["Vector"])
            nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
            nt.links.new(ramp.outputs["Color"], bsdf.inputs["Roughness"])

enhance_cycles_materials()

# 5. 주변 의정부 호원동 도시 맥락(아파트 단지 · 상가 · 가로등 · 도봉산/사패산 원경) 구축
def make_simple_mat(name, rgba, rough=0.75, metal=0.0):
    m = bpy.data.materials.new(name)
    if m.node_tree is None:
        m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    lin = tuple((c ** 2.2) for c in rgba[:3]) + (1.0,)
    bsdf.inputs["Base Color"].default_value = lin
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    return m

M_APT_WALL  = make_simple_mat("Env_AptWall",  (0.84, 0.81, 0.76), rough=0.80)
M_APT_WALL2 = make_simple_mat("Env_AptWall2", (0.76, 0.74, 0.70), rough=0.82)
M_APT_ACC   = make_simple_mat("Env_AptAcc",   (0.58, 0.42, 0.34), rough=0.82)
M_APT_ROOF  = make_simple_mat("Env_AptRoof",  (0.32, 0.46, 0.40), rough=0.86)
M_APT_WIN   = make_simple_mat("Env_AptWin",   (0.10, 0.16, 0.22), rough=0.06, metal=0.18)
M_MTN_FAR   = make_simple_mat("Env_Mountain", (0.20, 0.30, 0.22), rough=0.95)
M_POLE      = make_simple_mat("Env_Pole",     (0.35, 0.38, 0.42), rough=0.35, metal=0.85)
M_LAMP_GLOW = make_simple_mat("Env_Lamp",     (1.0,  0.94, 0.80), rough=0.15)

def add_env_box(name, w, h, d, mat, x, y, z, rot_y=0.0):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((w, d, h, 1.0)))
    bm.to_mesh(mesh)
    bm.free()
    obj.location = t2b(x, y, z)
    obj.rotation_euler = (0.0, 0.0, rot_y)
    obj.data.materials.append(mat)
    return obj

def add_apt_building(x, z, w, d, floors, rot_y=0.0, accent=False, base_y=-3.8):
    h = floors * 2.9
    mat_w = M_APT_WALL2 if accent else M_APT_WALL
    add_env_box("AptBody", w, h, d, mat_w, x, base_y + h * 0.5, z, rot_y=rot_y)
    add_env_box("AptRoof", w * 0.96, 0.5, d * 0.96, M_APT_ROOF, x, base_y + h + 0.25, z, rot_y=rot_y)
    # 옥탑 구조물
    add_env_box("AptTop", w * 0.28, 2.8, d * 0.45, mat_w, x, base_y + h + 1.4, z, rot_y=rot_y)
    # 층별 수평 창호 띠 (원경 아파트 리얼리티!)
    for fl in range(1, floors):
        fy = base_y + fl * 2.9 + 0.1
        add_env_box("AptWin", w + 0.12, 1.35, d + 0.12, M_APT_WIN, x, fy, z, rot_y=rot_y)

# 호원동 서쪽·북쪽·남서쪽 실제 주변 아파트 및 근린상가 배치
apt_specs = [
    # 전좌로 건너 서쪽 아파트 단지
    (-112, -35, 38, 14, 14, 0.31, False),
    (-124,  15, 42, 14, 15, 0.31, True),
    (-105,  68, 36, 14, 12, 0.31, False),
    (-160, -10, 44, 14, 16, 0.31, True),
    (-155,  48, 40, 14, 15, 0.31, False),
    # 북쪽 호원동 주거·아파트
    (-48, -112, 42, 14, 13, 0.05, False),
    (  8, -118, 46, 14, 15, 0.02, True),
    ( 65, -115, 40, 14, 14, -0.04, False),
    (118,  -95, 36, 14, 12, -0.15, True),
    # 동쪽·남동쪽 저층 빌라/근린상가
    (112, -25, 18, 12, 4, 0.0, True),
    (115,   5, 22, 14, 5, 0.0, False),
    (112,  35, 20, 13, 4, 0.0, True),
    (138,  18, 28, 14, 7, 0.0, False),
    ( 72,  76, 22, 14, 5, 0.0, False),
    ( 35,  78, 24, 13, 4, 0.0, True),
    ( -6,  82, 20, 14, 5, 0.12, False),
]
for ax, az, aw, ad, fl, ry, acc in apt_specs:
    add_apt_building(ax, az, aw, ad, fl, rot_y=ry, accent=acc)

# 전좌로 가로등 8기
ca, sa = math.cos(0.310), math.sin(0.310)
for lz in range(-60, 65, 18):
    lx = 6.4
    wx = -48.2 + lx * ca + lz * sa
    wz =   5.5 - lx * sa + lz * ca
    wy =   0.55 - lz * 0.022
    add_env_box("StreetPole", 0.16, 7.2, 0.16, M_POLE, wx, wy + 3.6, wz, rot_y=0.310)
    add_env_box("StreetArm",  1.8,  0.12, 0.12, M_POLE, wx - 0.8 * ca, wy + 7.1, wz + 0.8 * sa, rot_y=0.310)
    add_env_box("StreetLamp", 0.55, 0.14, 0.28, M_LAMP_GLOW, wx - 1.5 * ca, wy + 7.0, wz + 1.5 * sa, rot_y=0.310)

# 기존 알파-컷아웃 수목 인스턴싱으로 주변 수림 풍성하게 채우기 (RAM 절약 + 초고속!)
tree_woods = [o for o in bpy.data.objects if o.name.startswith("TreeWood_")]
tree_leafs = [o for o in bpy.data.objects if o.name.startswith("TreeLeaf_")]
if tree_woods and tree_leafs:
    rng_t = random.Random(2026)
    ring_pts = []
    # 동쪽·북쪽·남동쪽 외곽 숲
    for _ in range(55):
        ang = rng_t.uniform(-math.pi * 0.85, math.pi * 0.85)
        rad = rng_t.uniform(92, 168)
        px = 18 + math.cos(ang) * rad
        pz = -5 + math.sin(ang) * rad
        # 청사 중앙 영역 및 전좌로 회피
        if -58 < px < 88 and -68 < pz < 46:
            continue
        ring_pts.append((px, pz))
    for i, (px, pz) in enumerate(ring_pts):
        idx = i % min(len(tree_woods), len(tree_leafs))
        sc = rng_t.uniform(0.85, 1.45)
        rz = rng_t.uniform(0, math.pi * 2)
        for src in (tree_woods[idx], tree_leafs[idx]):
            inst = bpy.data.objects.new(f"EnvTree_{i}_{src.name}", src.data)
            scene.collection.objects.link(inst)
            inst.location = t2b(px, -3.8, pz)
            inst.rotation_euler = (0.0, 0.0, rz)
            inst.scale = (sc, sc, sc)

# 원경 도봉산 / 사패산 산능선 지형 (지평선 빈 공간 완전 차단!)
mtn_mesh = bpy.data.meshes.new("DobongsanRidge")
mtn_obj = bpy.data.objects.new("DobongsanRidge", mtn_mesh)
scene.collection.objects.link(mtn_obj)
bm_m = bmesh.new()
segs = 72
r_in, r_out = 210.0, 420.0
ring_in, ring_out = [], []
for i in range(segs):
    a = (i / segs) * math.pi * 2
    h_ridge = 28.0 + 26.0 * abs(math.sin(a * 2.5 + 0.7)) + 16.0 * math.sin(a * 6.0)
    # 북서·서쪽(도봉산/사패산 방향)을 더 웅장하게
    if math.cos(a) < 0.2:
        h_ridge *= 1.45
    v_in = bm_m.verts.new((math.cos(a) * r_in, math.sin(a) * r_in, -4.5))
    v_out = bm_m.verts.new((math.cos(a) * r_out, math.sin(a) * r_out, h_ridge))
    ring_in.append(v_in)
    ring_out.append(v_out)
for i in range(segs):
    ni = (i + 1) % segs
    bm_m.faces.new((ring_in[i], ring_out[i], ring_out[ni], ring_in[ni]))
bmesh.ops.recalc_face_normals(bm_m, faces=bm_m.faces)
bm_m.to_mesh(mtn_mesh)
bm_m.free()
mtn_obj.data.materials.append(M_MTN_FAR)
for p in mtn_obj.data.polygons:
    p.use_smooth = True

# 6. 드론 카메라 설정 및 2개 앵글 렌더링 (1920x1080 Full HD)
cam_data = bpy.data.cameras.new("DroneCam")
cam_data.lens = 38.0          # DJI Mavic 드론 표준 광각-표준 렌즈
cam_data.clip_start = 0.5
cam_data.clip_end = 1000.0
cam_obj = bpy.data.objects.new("DroneCam", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'

def aim_camera(pos_t, target_t):
    p = t2b(*pos_t)
    t = t2b(*target_t)
    cam_obj.location = p
    direction = t - p
    cam_obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

# 샷 1: 골든아워 대표 건축 드론 조감도
aim_camera((-62, 42, 78), (12, 3, 2))
scene.render.filepath = OUT_HERO
print("RENDERING SHOT 1:", OUT_HERO)
bpy.ops.render.render(write_still=True)

# 샷 2: 남측 4층·민원실·한글 현판·광장 클로즈업 저고도 드론샷
aim_camera((16, 11, 45), (18, 5, 10))
scene.render.filepath = OUT_SOUTH
print("RENDERING SHOT 2:", OUT_SOUTH)
bpy.ops.render.render(write_still=True)

print("ALL CYCLES DRONE RENDERS COMPLETED!")
