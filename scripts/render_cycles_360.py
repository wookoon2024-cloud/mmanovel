import bpy
import bmesh
import math
import os
import random
from mathutils import Vector, Matrix, Euler

# =============================================================================
# 경기북부병무지청 Blender 5.3 Cycles 360° 실사 VR 파노라마 렌더러 v1.0
# - mma_bukbu_blender.glb(DXF 1:1,000 실측) + Cycles 광추적 실사 쉐이더
# - 360° Equirectangular 파노라마 4개 지점 렌더링 (2048x1024, AgX + OIDN)
# - 출력: assets/pano360/pano_{drone,plaza,south,east}.jpg
# =============================================================================

BASE_DIR = r"c:\Pro1\2026상반기\mmanovel"
IN_GLB   = os.path.join(BASE_DIR, "mma_bukbu_blender.glb")
OUT_DIR  = os.path.join(BASE_DIR, "assets", "pano360")
os.makedirs(OUT_DIR, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def t2b(x, y, z):
    return Vector((x, -z, y))

# 1. 기존 정밀 GLB 모델 임포트
bpy.ops.import_scene.gltf(filepath=IN_GLB)

# 2. Cycles 광추적 엔진 + AgX + OpenImageDenoise
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.use_denoising = True
if hasattr(scene.cycles, "denoiser"):
    scene.cycles.denoiser = 'OPENIMAGEDENOISE'
if hasattr(scene.cycles, "denoising_input_passes"):
    scene.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.04
scene.cycles.samples = 28
scene.cycles.max_bounces = 6
scene.cycles.diffuse_bounces = 2
scene.cycles.glossy_bounces = 3
scene.cycles.transmission_bounces = 3
scene.cycles.transparent_max_bounces = 10

try:
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    scene.view_settings.view_transform = 'Filmic'
scene.view_settings.exposure = -0.80
scene.view_settings.gamma = 1.0

# 3. 물리 다중산란 대기 하늘 (골든아워 태양)
world = bpy.data.worlds.new("RealSkyWorld360")
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

# 4. Cycles 실사 쉐이더 업그레이드 (물리 AO + 나뭇잎 반투명 + 유리 반사 + 아스팔트 질감)
for mat in bpy.data.materials:
    if not mat.node_tree:
        continue
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if not bsdf:
        continue
    mname = mat.name

    if mname.startswith("Leaf_"):
        bsdf.inputs["Roughness"].default_value = 0.62
        if "Subsurface Weight" in bsdf.inputs:
            bsdf.inputs["Subsurface Weight"].default_value = 0.25
        if "Subsurface Scale" in bsdf.inputs:
            bsdf.inputs["Subsurface Scale"].default_value = 0.08
        continue

    if "Window" in mname or mname == "Glass":
        bsdf.inputs["Roughness"].default_value = 0.04
        bsdf.inputs["Metallic"].default_value = 0.12
        if "IOR" in bsdf.inputs:
            bsdf.inputs["IOR"].default_value = 1.52
        if "Coat Weight" in bsdf.inputs:
            bsdf.inputs["Coat Weight"].default_value = 1.0
        continue

    if any(k in mname for k in ("Limestone", "Terracotta", "Asphalt", "Plaza", "Retain", "Coping", "Grass")):
        base_in = bsdf.inputs["Base Color"]
        ao = nt.nodes.new("ShaderNodeAmbientOcclusion")
        ao.samples = 6
        ao.inputs["Distance"].default_value = 2.6 if "Asphalt" not in mname else 3.5
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
            nt.links.new(orig_sock, mix.inputs[6])
        else:
            mix.inputs[6].default_value = tuple(base_in.default_value)
        nt.links.new(gamma_ao.outputs["Color"], mix.inputs[7])
        nt.links.new(mix.outputs[2], base_in)

    if "Asphalt" in mname:
        tex_coord = nt.nodes.new("ShaderNodeTexCoord")
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 0.18
        noise.inputs["Detail"].default_value = 5.0
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.30
        ramp.color_ramp.elements[0].color = (0.48, 0.48, 0.48, 1.0)
        ramp.color_ramp.elements[1].position = 0.72
        ramp.color_ramp.elements[1].color = (0.88, 0.88, 0.88, 1.0)
        nt.links.new(tex_coord.outputs["Object"], noise.inputs["Vector"])
        nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], bsdf.inputs["Roughness"])

# 5. 주변 의정부 호원동 도시 맥락 + 도봉산 산능선
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
    add_env_box("AptTop", w * 0.28, 2.8, d * 0.45, mat_w, x, base_y + h + 1.4, z, rot_y=rot_y)
    for fl in range(1, floors):
        fy = base_y + fl * 2.9 + 0.1
        add_env_box("AptWin", w + 0.12, 1.35, d + 0.12, M_APT_WIN, x, fy, z, rot_y=rot_y)

apt_specs = [
    (-112, -35, 38, 14, 14, 0.31, False),
    (-124,  15, 42, 14, 15, 0.31, True),
    (-105,  68, 36, 14, 12, 0.31, False),
    (-160, -10, 44, 14, 16, 0.31, True),
    (-155,  48, 40, 14, 15, 0.31, False),
    (-48, -112, 42, 14, 13, 0.05, False),
    (  8, -118, 46, 14, 15, 0.02, True),
    ( 65, -115, 40, 14, 14, -0.04, False),
    (118,  -95, 36, 14, 12, -0.15, True),
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

ca, sa = math.cos(0.310), math.sin(0.310)
for lz in range(-60, 65, 18):
    lx = 6.4
    wx = -48.2 + lx * ca + lz * sa
    wz =   5.5 - lx * sa + lz * ca
    wy =   0.55 - lz * 0.022
    add_env_box("StreetPole", 0.16, 7.2, 0.16, M_POLE, wx, wy + 3.6, wz, rot_y=0.310)
    add_env_box("StreetArm",  1.8,  0.12, 0.12, M_POLE, wx - 0.8 * ca, wy + 7.1, wz + 0.8 * sa, rot_y=0.310)
    add_env_box("StreetLamp", 0.55, 0.14, 0.28, M_LAMP_GLOW, wx - 1.5 * ca, wy + 7.0, wz + 1.5 * sa, rot_y=0.310)

tree_woods = [o for o in bpy.data.objects if o.name.startswith("TreeWood_")]
tree_leafs = [o for o in bpy.data.objects if o.name.startswith("TreeLeaf_")]
if tree_woods and tree_leafs:
    rng_t = random.Random(2026)
    for i in range(55):
        ang = rng_t.uniform(-math.pi * 0.85, math.pi * 0.85)
        rad = rng_t.uniform(92, 168)
        px = 18 + math.cos(ang) * rad
        pz = -5 + math.sin(ang) * rad
        if -58 < px < 88 and -68 < pz < 46:
            continue
        idx = i % min(len(tree_woods), len(tree_leafs))
        sc = rng_t.uniform(0.85, 1.45)
        rz = rng_t.uniform(0, math.pi * 2)
        for src in (tree_woods[idx], tree_leafs[idx]):
            inst = bpy.data.objects.new(f"EnvTree_{i}_{src.name}", src.data)
            scene.collection.objects.link(inst)
            inst.location = t2b(px, -3.8, pz)
            inst.rotation_euler = (0.0, 0.0, rz)
            inst.scale = (sc, sc, sc)

# 원경 도봉산 / 사패산 산능선
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
    if math.cos(a) < 0.2:
        h_ridge *= 1.45
    ring_in.append(bm_m.verts.new((math.cos(a) * r_in, math.sin(a) * r_in, -4.5)))
    ring_out.append(bm_m.verts.new((math.cos(a) * r_out, math.sin(a) * r_out, h_ridge)))
for i in range(segs):
    ni = (i + 1) % segs
    bm_m.faces.new((ring_in[i], ring_out[i], ring_out[ni], ring_in[ni]))
bmesh.ops.recalc_face_normals(bm_m, faces=bm_m.faces)
bm_m.to_mesh(mtn_mesh)
bm_m.free()
mtn_obj.data.materials.append(M_MTN_FAR)
for p in mtn_obj.data.polygons:
    p.use_smooth = True

# 6. 360° Equirectangular 파노라마 카메라 설정
cam_data = bpy.data.cameras.new("Pano360Cam")
cam_data.type = 'PANO'
if hasattr(cam_data, "panorama_type"):
    cam_data.panorama_type = 'EQUIRECTANGULAR'
elif hasattr(cam_data, "cycles") and hasattr(cam_data.cycles, "panorama_type"):
    cam_data.cycles.panorama_type = 'EQUIRECTANGULAR'
cam_data.clip_start = 0.2
cam_data.clip_end = 1000.0
cam_obj = bpy.data.objects.new("Pano360Cam", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
# 수평 유지 (Blender에서 카메라 기본 -Z를 수평 북쪽 +Y로 향하게: rot_x = +90도)
cam_obj.rotation_euler = (math.pi / 2.0, 0.0, 0.0)

scene.render.resolution_x = 2048
scene.render.resolution_y = 1024
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 92

# 4개 핵심 VR 투어 지점 렌더링
SPOTS = [
    ("pano_drone.jpg", (-34.0, 28.0, 48.0)),  # 1. 상공 360° 드론 조감도
    ("pano_plaza.jpg", ( -1.5,  2.2, 13.5)),  # 2. 중앙 체크무늬 광장
    ("pano_south.jpg", ( 28.0, -1.2, 31.5)),  # 3. 별관 남면 · 민원실 앞
    ("pano_east.jpg",  ( 58.0, -1.2, 11.5)),  # 4. 동쪽 주차장 · 구름다리
]

for fname, pos in SPOTS:
    cam_obj.location = t2b(*pos)
    out_path = os.path.join(OUT_DIR, fname)
    scene.render.filepath = out_path
    print("RENDERING 360 PANO:", out_path)
    bpy.ops.render.render(write_still=True)

print("ALL 4 CYCLES 360 PANORAMAS COMPLETED!")
