import bpy
import bmesh
import json
import math
import os
import random
from mathutils import Vector, Matrix, Euler

# =============================================================================
# 경기북부병무지청 Blender + Three.js 실사 건축 GLB 생성기 v2.0
# - 국토지리정보원 1:1,000 DXF (dxf_pure.json) 실측 좌표 100% 기반
# - 고해상도 PBR 텍스처 (Color + Normal Map) + 월드 스케일 Box-Projection UV
# - 알파 컷아웃 잔잎/솔잎 클러스터 수목 (찰흙 공 나무 완전 제거!)
# - 깊은 3D 창호 리세스 · 돌출 기둥/슬래브 · 중공 옥상 파라펫 · 한글 현판 5종
# - 출력: c:\Pro1\2026상반기\mmanovel\mma_bukbu_blender.glb
# =============================================================================

BASE_DIR = r"c:\Pro1\2026상반기\mmanovel"
PBR_DIR  = os.path.join(BASE_DIR, "assets", "pbr")
DXF_JSON = os.path.join(BASE_DIR, "dxf_pure.json")
OUT_GLB  = os.path.join(BASE_DIR, "mma_bukbu_blender.glb")
LOW_Y    = -3.8  # 하부 민원실 · 동쪽 순환 주차장 레벨

# 1. 씬 초기화
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def t2b(x, y, z):
    """Three.js (x, y_up, z_south) -> Blender (x, -z_south, y_up)"""
    return (x, -z, y)

# =============================================================================
# PBR 재질 시스템 (단색 + 이미지 텍스처 + 노멀맵 + 알파 컷아웃)
# =============================================================================
MATS = {}
IMAGES = {}

def load_img(filename, non_color=False):
    key = (filename, non_color)
    if key in IMAGES:
        return IMAGES[key]
    path = os.path.join(PBR_DIR, filename)
    img = bpy.data.images.load(path, check_existing=False)
    img.colorspace_settings.name = 'Non-Color' if non_color else 'sRGB'
    IMAGES[key] = img
    return img

def get_mat(name, color, roughness=0.75, metallic=0.0, alpha=1.0, coat=0.0):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    if m.node_tree is None:
        m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    lin = tuple(((c / 255.0) ** 2.2) for c in color)
    bsdf.inputs["Base Color"].default_value = (lin[0], lin[1], lin[2], 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        if hasattr(m, "blend_method"):
            m.blend_method = 'BLEND'
    if coat > 0.0 and "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = coat
    MATS[name] = m
    return m

def make_pbr_mat(name, col_file, nrm_file=None, roughness=0.78, metallic=0.0, coat=0.0,
                 nrm_strength=0.85, alpha_clip=False):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    if m.node_tree is None:
        m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if coat > 0.0 and "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = coat

    tex_col = nt.nodes.new("ShaderNodeTexImage")
    tex_col.image = load_img(col_file, non_color=False)
    nt.links.new(tex_col.outputs["Color"], bsdf.inputs["Base Color"])

    if alpha_clip:
        nt.links.new(tex_col.outputs["Alpha"], bsdf.inputs["Alpha"])
        if hasattr(m, "blend_method"):
            m.blend_method = 'CLIP'
        if hasattr(m, "alpha_threshold"):
            m.alpha_threshold = 0.45

    if nrm_file:
        tex_nrm = nt.nodes.new("ShaderNodeTexImage")
        tex_nrm.image = load_img(nrm_file, non_color=True)
        nrm_node = nt.nodes.new("ShaderNodeNormalMap")
        nrm_node.inputs["Strength"].default_value = nrm_strength
        nt.links.new(tex_nrm.outputs["Color"], nrm_node.inputs["Color"])
        nt.links.new(nrm_node.outputs["Normal"], bsdf.inputs["Normal"])

    MATS[name] = m
    return m

# 고해상도 PBR 텍스처 재질
M_LIMESTONE = make_pbr_mat("LimestonePBR",  "limestone_col.png", "limestone_nrm.png", roughness=0.72, nrm_strength=0.90)
M_BRICK     = make_pbr_mat("TerracottaPBR", "brick_col.png",     "brick_nrm.png",     roughness=0.84, nrm_strength=1.10)
M_ASPHALT   = make_pbr_mat("AsphaltPBR",    "asphalt_col.png",   "asphalt_nrm.png",   roughness=0.88, nrm_strength=0.75)
M_GRASS     = make_pbr_mat("GrassPBR",      "grass_col.png",     "grass_nrm.png",     roughness=0.92, nrm_strength=0.65)
M_PLAZA     = make_pbr_mat("PlazaPBR",      "plaza_col.png",     "plaza_nrm.png",     roughness=0.80, nrm_strength=0.85)
M_WINDOW    = make_pbr_mat("WindowGlassPBR","window_col.png",    None,                roughness=0.08, metallic=0.28, coat=1.0)

# 알파 컷아웃 잔잎/솔잎 수목 재질 (Three.js에서 Leaf_* 감지 -> alphaTest + DoubleSide)
M_LEAF_PINE  = make_pbr_mat("Leaf_Pine",  "leaf_pine.png",  None, roughness=0.82, alpha_clip=True)
M_LEAF_OAK   = make_pbr_mat("Leaf_Oak",   "leaf_oak.png",   None, roughness=0.80, alpha_clip=True)
M_LEAF_MAPLE = make_pbr_mat("Leaf_Maple", "leaf_maple.png", None, roughness=0.78, alpha_clip=True)

# 한글 현판 5종
M_SIGN_MAIN   = make_pbr_mat("Sign_Main",      "sign_main.png",       None, roughness=0.55)
M_SIGN_ANN_V  = make_pbr_mat("Sign_AnnexV",    "sign_annex_v.png",    None, roughness=0.55)
M_SIGN_ANN_E  = make_pbr_mat("Sign_AnnexEast", "sign_annex_east.png", None, roughness=0.55)
M_SIGN_MINWON = make_pbr_mat("Sign_Minwon",    "sign_minwon.png",     None, roughness=0.45)
M_SIGN_SLOGAN = make_pbr_mat("Sign_Slogan",    "sign_slogan.png",     None, roughness=0.45)
M_SIGN_EXAM_G = make_pbr_mat("Sign_ExamGold",  "sign_exam_gold.png",  None, roughness=0.35, metallic=0.35)
M_SIGN_GATE   = make_pbr_mat("Sign_Gate",      "sign_gate.png",       None, roughness=0.32, metallic=0.65)

# 보조 건축 재질
M_COPING     = get_mat("Coping",       (214, 208, 198), roughness=0.75)
M_CONTACT_AO = get_mat("ContactAO",    (98,  96,  92),  roughness=0.92)
M_YELLOW     = get_mat("YellowRotunda",(222, 194, 96),  roughness=0.38, metallic=0.20, coat=0.4)
M_ROOF_GRN   = get_mat("GreenRoof",    (52,  104, 84),  roughness=0.85)
M_ROOF_BLU   = get_mat("BlueRoof",     (42,  98,  196), roughness=0.55, metallic=0.20)
M_SOLAR      = get_mat("SolarPanel",   (20,  34,  74),  roughness=0.14, metallic=0.68, coat=0.85)
M_GLASS      = get_mat("Glass",        (34,  86,  98),  roughness=0.06, metallic=0.28, coat=1.0)
M_SPANDREL   = get_mat("MintSpandrel", (142, 198, 186), roughness=0.18, metallic=0.16, coat=0.75)
M_FRAME      = get_mat("DarkFrame",    (38,  44,  52),  roughness=0.40, metallic=0.58)
M_RAIL       = get_mat("Stainless",    (218, 224, 230), roughness=0.22, metallic=0.85)
M_RETAIN     = get_mat("RetainWall",   (176, 174, 166), roughness=0.86)
M_SIDEWALK   = get_mat("RedSidewalk",  (168, 120, 98),  roughness=0.85)
M_HEDGE      = get_mat("Hedge",        (48,  84,  42),  roughness=0.90)
M_WHITE      = get_mat("RoadWhite",    (244, 242, 236), roughness=0.55)
M_YELLOW_LN  = get_mat("RoadYellow",   (238, 194, 48),  roughness=0.55)
M_HANDICAP   = get_mat("HandicapBlue", (48,  106, 212), roughness=0.65)
M_WOOD       = get_mat("GazeboWood",   (126, 80,  44),  roughness=0.78)
M_BARK       = get_mat("Bark",         (84,  58,  40),  roughness=0.92)
M_FENCE      = get_mat("FenceMesh",    (52,  62,  72),  roughness=0.55, metallic=0.50, alpha=0.58)
M_WHEEL      = get_mat("Tire",         (24,  26,  30),  roughness=0.90)
M_TENNIS     = get_mat("TennisCourt",  (56,  108, 66),  roughness=0.85)

CAR_MATS = [
    get_mat("CarWhite",  (242, 242, 238), roughness=0.20, metallic=0.30, coat=1.0),
    get_mat("CarSilver", (175, 182, 190), roughness=0.22, metallic=0.55, coat=1.0),
    get_mat("CarDark",   (44,  52,  64),  roughness=0.20, metallic=0.45, coat=1.0),
    get_mat("CarNavy",   (36,  58,  102), roughness=0.20, metallic=0.45, coat=1.0),
    get_mat("CarGraph",  (86,  92,  100), roughness=0.22, metallic=0.50, coat=1.0),
]

# =============================================================================
# UV & 지오메트리 빌더
# =============================================================================
def box_project_uv(bm, scale_m=4.0):
    """월드 스케일 트라이플래너 Box-Projection UV 자동 부여"""
    uv_layer = bm.loops.layers.uv.verify()
    inv = 1.0 / max(scale_m, 0.1)
    for f in bm.faces:
        nx, ny, nz = abs(f.normal.x), abs(f.normal.y), abs(f.normal.z)
        if nz >= nx and nz >= ny:
            for loop in f.loops:
                co = loop.vert.co
                loop[uv_layer].uv = (co.x * inv, co.y * inv)
        elif nx >= ny:
            for loop in f.loops:
                co = loop.vert.co
                loop[uv_layer].uv = (co.y * inv, co.z * inv)
        else:
            for loop in f.loops:
                co = loop.vert.co
                loop[uv_layer].uv = (co.x * inv, co.z * inv)

def add_bevel(obj, width=0.06, segments=2):
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments
    mod.limit_method = 'ANGLE'

def add_box(name, w, h, d, mat, x, y, z, rot_y=0.0, rot_z=0.0, rot_x=0.0, bevel=0.0, uv_scale=4.0):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((w, d, h, 1.0)))
    box_project_uv(bm, uv_scale)
    bm.to_mesh(mesh)
    bm.free()
    obj.location = t2b(x, y, z)
    obj.rotation_euler = (rot_x, -rot_z, rot_y)
    obj.data.materials.append(mat)
    if bevel > 0:
        add_bevel(obj, width=bevel, segments=2)
    return obj

def extrude_dxf_poly(name, pts_xz, base_y, height, mat, bevel=0.05, uv_scale=4.5):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    bm = bmesh.new()
    verts = [bm.verts.new((px, -pz, base_y)) for (px, pz) in pts_xz]
    bm.verts.ensure_lookup_table()
    try:
        face = bm.faces.new(verts)
    except ValueError:
        bm.free()
        return obj
    res = bmesh.ops.extrude_face_region(bm, geom=[face])
    ext_verts = [e for e in res["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0.0, 0.0, height), verts=ext_verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    box_project_uv(bm, uv_scale)
    bm.to_mesh(mesh)
    bm.free()
    obj.data.materials.append(mat)
    if bevel > 0:
        add_bevel(obj, width=bevel, segments=2)
    return obj

def add_hollow_parapet(name, pts_xz, base_y, height, thickness, mat, uv_scale=4.0):
    """DXF 폴리곤 외곽을 따라 실제 중공 옥상 파라펫 벽체 생성 (깊은 옥상 그림자!)"""
    n = len(pts_xz)
    if n < 3:
        return
    # 폴리곤 중심 기준 안쪽 오프셋 계산
    cx = sum(p[0] for p in pts_xz) / n
    cz = sum(p[1] for p in pts_xz) / n
    for i in range(n):
        x1, z1 = pts_xz[i]
        x2, z2 = pts_xz[(i + 1) % n]
        dx, dz = x2 - x1, z2 - z1
        seg_len = math.hypot(dx, dz)
        if seg_len < 0.4:
            continue
        mx, mz = (x1 + x2) * 0.5, (z1 + z2) * 0.5
        # 안쪽 법선 방향
        nx, nz = -dz / seg_len, dx / seg_len
        if (cx - mx) * nx + (cz - mz) * nz < 0:
            nx, nz = -nx, -nz
        px = mx + nx * (thickness * 0.5)
        pz = mz + nz * (thickness * 0.5)
        rot_y = -math.atan2(dz, dx)
        add_box(f"{name}_{i}", seg_len + thickness * 0.6, height, thickness, mat,
                px, base_y + height * 0.5, pz, rot_y=rot_y, bevel=0.03, uv_scale=uv_scale)

def add_cylinder(name, r_top, r_bot, h, mat, x, y, z, segs=32, rot_x=0.0, rot_y=0.0, rot_z=0.0):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r_bot, radius2=r_top, depth=h)
    box_project_uv(bm, 4.0)
    bm.to_mesh(mesh)
    bm.free()
    obj.location = t2b(x, y, z)
    obj.rotation_euler = (rot_x, -rot_z, rot_y)
    obj.data.materials.append(mat)
    return obj

def add_sign_plane(name, w, h, mat, x, y, z, rot_y=0.0):
    """정확한 0..1 UV 한글 현판 평면 (rot_y=0: 남향 +Z, rot_y=pi/2: 동향 +X)"""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    bm = bmesh.new()
    v0 = bm.verts.new((-w * 0.5, 0.0, -h * 0.5))
    v1 = bm.verts.new(( w * 0.5, 0.0, -h * 0.5))
    v2 = bm.verts.new(( w * 0.5, 0.0,  h * 0.5))
    v3 = bm.verts.new((-w * 0.5, 0.0,  h * 0.5))
    f = bm.faces.new((v0, v1, v2, v3))
    uv_layer = bm.loops.layers.uv.verify()
    uvs = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
    for loop, uv in zip(f.loops, uvs):
        loop[uv_layer].uv = uv
    bm.to_mesh(mesh)
    bm.free()
    obj.location = t2b(x, y, z)
    obj.rotation_euler = (0.0, 0.0, rot_y)
    obj.data.materials.append(mat)
    return obj

# =============================================================================
# 실사 다분기 알파-컷아웃 잔잎 수목 (찰흙 공 나무 완전 제거!)
# =============================================================================
def add_realistic_tree(x, y, z, h=7.5, kind='pine', seed=1):
    rng = random.Random(seed * 997 + 13)
    s = h / 7.2

    # 1) 줄기 + 5개 주가지 (단일 통합 메시)
    wood_mesh = bpy.data.meshes.new(f"TreeWood_{seed}")
    wood_obj = bpy.data.objects.new(f"TreeWood_{seed}", wood_mesh)
    scene.collection.objects.link(wood_obj)
    bm_w = bmesh.new()

    trunk_h = (3.4 if kind == 'pine' else 2.8) * s
    bmesh.ops.create_cone(
        bm_w, cap_ends=True, cap_tris=False, segments=8,
        radius1=0.24 * s, radius2=0.10 * s, depth=trunk_h,
        matrix=Matrix.Translation((0.0, 0.0, trunk_h * 0.5))
    )
    branch_tips = [(0.0, 0.0, trunk_h + 1.4 * s)]
    num_branches = 6 if kind == 'pine' else 5
    for bi in range(num_branches):
        az = (bi / num_branches) * math.pi * 2 + rng.uniform(-0.35, 0.35)
        tilt = rng.uniform(0.55, 0.92) if kind == 'pine' else rng.uniform(0.42, 0.78)
        blen = rng.uniform(1.6, 2.5) * s
        start_z = trunk_h * rng.uniform(0.55, 0.92)
        rot_m = Euler((tilt, 0.0, az), 'XYZ').to_matrix().to_4x4()
        mid_v = rot_m @ Vector((0.0, 0.0, blen * 0.5))
        tip_v = rot_m @ Vector((0.0, 0.0, blen))
        mat_b = Matrix.Translation((mid_v.x, mid_v.y, start_z + mid_v.z)) @ rot_m
        bmesh.ops.create_cone(
            bm_w, cap_ends=True, cap_tris=False, segments=6,
            radius1=0.09 * s, radius2=0.03 * s, depth=blen,
            matrix=mat_b
        )
        branch_tips.append((tip_v.x, tip_v.y, start_z + tip_v.z))

    box_project_uv(bm_w, 1.5)
    bm_w.to_mesh(wood_mesh)
    bm_w.free()
    wood_obj.location = t2b(x, y, z)
    wood_obj.data.materials.append(M_BARK)

    # 2) 교차 알파 컷아웃 잔잎/솔잎 카드 클러스터 (56~68장 통합 메시)
    leaf_mat = M_LEAF_PINE if kind == 'pine' else (M_LEAF_MAPLE if kind == 'maple' else M_LEAF_OAK)
    leaf_mesh = bpy.data.meshes.new(f"TreeLeaf_{seed}")
    leaf_obj = bpy.data.objects.new(f"TreeLeaf_{seed}", leaf_mesh)
    scene.collection.objects.link(leaf_obj)
    bm_l = bmesh.new()
    uv_layer = bm_l.loops.layers.uv.verify()

    card_count = 64 if kind == 'pine' else 56
    for ci in range(card_count):
        tip = branch_tips[ci % len(branch_tips)]
        spread_xy = (1.65 if kind == 'pine' else 1.40) * s
        spread_z  = (0.85 if kind == 'pine' else 1.25) * s
        cx = tip[0] + rng.uniform(-spread_xy, spread_xy) * rng.uniform(0.35, 1.0)
        cy = tip[1] + rng.uniform(-spread_xy, spread_xy) * rng.uniform(0.35, 1.0)
        cz = tip[2] + rng.uniform(-spread_z * 0.45, spread_z)
        if cz < trunk_h * 0.55:
            cz = trunk_h * 0.55 + rng.uniform(0.2, 0.8) * s

        card_sz = rng.uniform(1.55, 2.45) * s
        hs = card_sz * 0.5
        # 교차 각도: 수평 우산형 + 비스듬한 수직 카드 혼합 (모든 각도에서 빽빽한 잔잎!)
        if ci % 3 == 0:
            rx = rng.uniform(1.15, 1.50)  # 수평에 가까운 잎층
        else:
            rx = rng.uniform(0.35, 1.05)  # 비스듬한 입체 카드
        ry = rng.uniform(-0.55, 0.55)
        rz = rng.uniform(0.0, math.pi * 2)
        xf = Matrix.Translation((cx, cy, cz)) @ Euler((rx, ry, rz), 'XYZ').to_matrix().to_4x4()

        pts = [
            xf @ Vector((-hs, 0.0, -hs)),
            xf @ Vector(( hs, 0.0, -hs)),
            xf @ Vector(( hs, 0.0,  hs)),
            xf @ Vector((-hs, 0.0,  hs)),
        ]
        vs = [bm_l.verts.new(p) for p in pts]
        f = bm_l.faces.new(vs)
        for loop, uv in zip(f.loops, [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]):
            loop[uv_layer].uv = uv

    bm_l.to_mesh(leaf_mesh)
    bm_l.free()
    leaf_obj.location = t2b(x, y, z)
    leaf_obj.data.materials.append(leaf_mat)

# 세련된 Bevel 건축 차량
def add_sleek_car(x, y, z, rot_y=0.0, idx=0):
    bm_mat = CAR_MATS[idx % len(CAR_MATS)]
    parent = bpy.data.objects.new(f"Car_{idx}_{int(x)}_{int(z)}", None)
    scene.collection.objects.link(parent)
    parent.location = t2b(x, y, z)
    parent.rotation_euler = (0.0, 0.0, rot_y)

    def cbox(w, h, d, mat, lx, ly, lz, bev=0.06):
        o = add_box("cp", w, h, d, mat, lx, ly, lz, bevel=bev)
        o.parent = parent
        o.location = t2b(lx, ly, lz)
        return o

    cbox(1.82, 0.56, 4.25, bm_mat, 0, 0.52, 0, bev=0.10)
    cbox(1.56, 0.50, 2.15, bm_mat, 0, 1.00, -0.15, bev=0.12)
    cbox(1.60, 0.36, 1.85, M_GLASS, 0, 1.00, -0.15, bev=0.04)
    for wx, wz in [(-0.86, 1.25), (0.86, 1.25), (-0.86, -1.25), (0.86, -1.25)]:
        w = add_cylinder("wh", 0.27, 0.27, 0.22, M_WHEEL, wx, 0.27, wz, segs=14, rot_z=math.pi/2)
        w.parent = parent
        w.location = t2b(wx, 0.27, wz)

def build_parking_row_ns(start_x, y, z, count, bay_w=2.55, bay_d=5.0, direction='north', cars=(), handicap=()):
    tw = count * bay_w
    bz = z - bay_d/2 if direction == 'north' else z + bay_d/2
    add_box("PL_Back", tw + 0.12, 0.03, 0.12, M_WHITE, start_x + tw/2, y + 0.03, bz)
    for i in range(count + 1):
        add_box("PL_Line", 0.12, 0.03, bay_d, M_WHITE, start_x + i * bay_w, y + 0.03, z)
        if i < count:
            cx = start_x + (i + 0.5) * bay_w
            sz = (z - bay_d/2 + 0.9) if direction == 'north' else (z + bay_d/2 - 0.9)
            if i in handicap:
                add_box("PL_HC", bay_w - 0.24, 0.035, bay_d - 0.24, M_HANDICAP, cx, y + 0.025, z)
            add_box("PL_Stop", 1.6, 0.11, 0.16, M_YELLOW_LN, cx, y + 0.06, sz, bevel=0.02)
            if i in cars:
                add_sleek_car(cx, y, z, 0.0 if direction == 'north' else math.pi, i * 3 + abs(int(z)))

def build_parking_col_ew(x, y, start_z, count, bay_w=2.55, bay_d=5.0, direction='west', cars=()):
    td = count * bay_w
    bx = x - bay_d/2 if direction == 'west' else x + bay_d/2
    add_box("PC_Back", 0.12, 0.03, td + 0.12, M_WHITE, bx, y + 0.03, start_z + td/2)
    for i in range(count + 1):
        add_box("PC_Line", bay_d, 0.03, 0.12, M_WHITE, x, y + 0.03, start_z + i * bay_w)
        if i < count:
            cz = start_z + (i + 0.5) * bay_w
            sx = (x - bay_d/2 + 0.9) if direction == 'west' else (x + bay_d/2 - 0.9)
            add_box("PC_Stop", 0.16, 0.11, 1.6, M_YELLOW_LN, sx, y + 0.06, cz, bevel=0.02)
            if i in cars:
                add_sleek_car(x, y, cz, math.pi/2 if direction == 'west' else -math.pi/2, i * 5 + abs(int(x)))

# =============================================================================
# 2. DXF 1:1,000 실측 데이터 로드 및 지형 · 광장 · 옹벽 · 도로 구축
# =============================================================================
with open(DXF_JSON, "r", encoding="utf-8") as f:
    dxf = json.load(f)

# 대지 기본 잔디 바닥 (PBR 잔디 + 노멀맵)
add_box("BaseGround", 420, 0.4, 420, M_GRASS, 10, LOW_Y - 0.25, 0, uv_scale=12.0)

# 상부 청사 테라스 (y = 0.0m)
add_box("UpperTerrace", 74.5, -LOW_Y, 90.5, M_RETAIN, -10.75, LOW_Y/2, -19.25, uv_scale=5.0)
add_box("UpperAsphalt", 74.1, 0.06, 90.1, M_ASPHALT, -10.75, 0.0, -19.25, uv_scale=8.0)

# 정문 진입 평지 + 완만한 내리막 차도 (x=-22..+16)
add_box("GateApronBase", 17.6, -LOW_Y, 9.2, M_RETAIN, -30.5, LOW_Y/2, 30.8, uv_scale=5.0)
add_box("GateApronTop",  17.6, 0.06,   9.2, M_ASPHALT, -30.5, 0.0, 30.8, uv_scale=8.0)

ramp_start_x, ramp_end_x = -22.0, 16.0
ramp_run = ramp_end_x - ramp_start_x
ramp_hyp = math.hypot(ramp_run, -LOW_Y)
ramp_ang = math.atan2(-LOW_Y, ramp_run)
ramp_cx  = (ramp_start_x + ramp_end_x) / 2.0
add_box("DriveRampDeck", ramp_hyp + 0.8, 0.45, 9.2, M_ASPHALT, ramp_cx, LOW_Y/2 - 0.18, 30.8, rot_z=-ramp_ang, uv_scale=8.0)
add_box("DriveRampBase", ramp_hyp, 2.2, 9.0, M_RETAIN, ramp_cx, LOW_Y/2 - 1.5, 30.8, rot_z=-ramp_ang, uv_scale=5.0)

# 하부 평지 아스팔트
add_box("LowerDriveAsph", 31.0, 0.06, 16.0, M_ASPHALT, 30.5, LOW_Y, 27.5, uv_scale=8.0)
add_box("LowerEastAsph",  41.5, 0.06, 56.8, M_ASPHALT, 64.5, LOW_Y, 13.4, uv_scale=8.0)
add_box("LowerCourtyard", 19.5, 0.06, 36.5, M_ASPHALT, 36.0, LOW_Y, 3.2,  uv_scale=8.0)

# 세로 옹벽 + 3m 간격 기둥 + 4단 스테인리스 난간 + 대각선 외부 계단 + 접지 AO
add_box("RetainMain", 40.5, -LOW_Y + 0.2, 0.55, M_RETAIN, -1.75, LOW_Y/2, 26.1, bevel=0.04, uv_scale=4.5)
add_box("RetainAO",   40.6, 0.25, 0.72, M_CONTACT_AO, -1.75, LOW_Y + 0.12, 26.1)
for px in range(-20, 19, 3):
    add_box("RetainPil", 0.35, -LOW_Y + 0.28, 0.68, M_COPING, px, LOW_Y/2, 26.1, bevel=0.03)
    add_box("RailPost", 0.06, 1.05, 0.06, M_RAIL, px, 0.55, 26.1)
for ry in (0.35, 0.62, 0.88, 1.08):
    add_box("RailBar", 39.0, 0.045, 0.045, M_RAIL, -1.5, ry, 26.1)
for st in range(16):
    add_box("ExtStair", 0.36, 0.24, 1.9, M_COPING, 18.2 + st * 0.32, -0.15 - st * (3.65/16), 23.6, bevel=0.02)

# 중앙 체크무늬 광장 (PBR 체크 보도블록 + 노멀맵) + 소나무 잔디 화단 2개 + 점자블록
add_box("PlazaBase", 36.0, 0.14, 30.0, M_PLAZA, -10.0, 0.07, 10.5, bevel=0.02, uv_scale=12.0)
add_box("PineBedL", 9.2, 0.42, 19.5, M_GRASS, -19.2, 0.22, 11.8, bevel=0.05, uv_scale=6.0)
add_box("PineBedR", 9.2, 0.42, 19.5, M_GRASS, -8.5,  0.22, 11.8, bevel=0.05, uv_scale=6.0)
add_box("PineCurbL", 9.5, 0.26, 19.8, M_COPING, -19.2, 0.14, 11.8, bevel=0.03)
add_box("PineCurbR", 9.5, 0.26, 19.8, M_COPING, -8.5,  0.14, 11.8, bevel=0.03)
add_box("TactileV", 0.40, 0.16, 28.0, M_YELLOW_LN, 2.2, 0.08, 11.5)
add_box("TactileH", 30.0, 0.16, 0.40, M_YELLOW_LN, -12.5, 0.08, 25.0)

# 360° 외벽 · 철제 펜스 완전 밀폐
def get_drive_y(x):
    if x <= ramp_start_x: return 0.0
    if x >= ramp_end_x: return LOW_Y
    return ((x - ramp_start_x) / ramp_run) * LOW_Y

add_box("SouthCurbSlope", ramp_hyp + 0.8, 0.35, 0.38, M_COPING, ramp_cx, LOW_Y/2 + 0.16, 35.5, rot_z=-ramp_ang)
add_box("SouthFenceSlope", ramp_hyp + 0.8, 1.15, 0.06, M_FENCE, ramp_cx, LOW_Y/2 + 0.88, 35.5, rot_z=-ramp_ang)
for fx in range(-22, 45, 2):
    add_box("SFPost", 0.08, 1.55, 0.08, M_FRAME, fx, get_drive_y(fx) + 0.78, 35.5)
add_box("SouthCurbFlat", 28.2, 0.45, 0.42, M_COPING, 30.0, LOW_Y + 0.22, 35.5)
add_box("SouthFenceFlat", 28.2, 1.15, 0.06, M_FENCE, 30.0, LOW_Y + 0.98, 35.5)
add_box("SouthCornerWall", 0.65, 2.4, 6.7, M_RETAIN, 44.0, LOW_Y + 1.2, 38.65, bevel=0.04)
add_box("SouthEastWall", 41.8, 2.4, 0.65, M_RETAIN, 64.6, LOW_Y + 1.2, 41.8, bevel=0.04)
add_box("EastWall", 0.65, 2.8, 57.2, M_RETAIN, 85.2, LOW_Y + 1.4, 13.4, bevel=0.04)
add_box("NorthEastWall", 59.0, 2.8, 0.65, M_RETAIN, 55.85, LOW_Y + 1.4, -15.0, bevel=0.04)
add_box("NorthConnWall", 0.65, 2.4, 50.0, M_RETAIN, 26.5, 1.2, -39.75, bevel=0.04)
add_box("NorthWall", 81.0, 2.2, 0.65, M_RETAIN, -13.75, 1.1, -64.5, bevel=0.04)

# 서쪽 전좌로 (+0.310 rad 검증 완료!) + 인도 + 생울타리 + 정문
road_root = bpy.data.objects.new("JeonjwaRoad", None)
scene.collection.objects.link(road_root)
road_root.location = t2b(-48.2, 0.55, 5.5)
road_root.rotation_euler = (0.022, 0.0, +0.310)

def rbox(w, h, d, mat, lx, ly, lz, bev=0.0, uv_scale=8.0):
    o = add_box("rd", w, h, d, mat, lx, ly, lz, bevel=bev, uv_scale=uv_scale)
    o.parent = road_root
    o.location = t2b(lx, ly, lz)
    return o

rbox(11.6, 0.4, 185, M_ASPHALT, 0, -0.2, 0, uv_scale=9.0)
rbox(0.32, 0.24, 185, M_COPING, -5.92, 0.10, 0, bev=0.03)
rbox(3.4,  0.4, 185, M_SIDEWALK, -7.75, -0.08, 0)
rbox(0.32, 0.24, 110, M_COPING, 5.92, 0.10, -37.5, bev=0.03)
rbox(0.32, 0.24, 62,  M_COPING, 5.92, 0.10, 61.5, bev=0.03)
rbox(3.8,  0.4, 110, M_SIDEWALK, 7.95, -0.08, -37.5)
rbox(3.8,  0.4, 62,  M_SIDEWALK, 7.95, -0.08, 61.5)
rbox(4.6,  0.38, 13.0, M_ASPHALT, 7.8, -0.19, 24.0, uv_scale=8.0)
for lx in (-0.17, 0.17):
    rbox(0.14, 0.025, 110, M_YELLOW_LN, lx, 0.015, -37.5)
    rbox(0.14, 0.025, 62,  M_YELLOW_LN, lx, 0.015, 61.5)
rbox(0.14, 0.025, 185, M_WHITE, -5.3, 0.015, 0)
rbox(0.14, 0.025, 110, M_WHITE, 5.3,  0.015, -37.5)
rbox(0.14, 0.025, 62,  M_WHITE, 5.3,  0.015, 61.5)
for cx in (-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2):
    rbox(0.58, 0.028, 3.6, M_WHITE, cx, 0.016, 36.0)
rbox(1.1, 1.75, 58.0, M_HEDGE, 9.8, 0.88, -11.0, bev=0.15)
# 실제 정문 입구 (사진 100% 실측 반영 — 전좌로와 평행 +0.310 rad, 서쪽 도로를 정면으로 향함!)
gate_root = bpy.data.objects.new("MainGateRoot", None)
scene.collection.objects.link(gate_root)
gate_root.location = t2b(-35.2, 0.0, 30.8)
gate_root.rotation_euler = (0.0, 0.0, +0.310)

def gbox(name, w, h, d, mat, lx, ly, lz, bev=0.03, uv_scale=3.0):
    o = add_box(name, w, h, d, mat, lx, ly, lz, bevel=bev, uv_scale=uv_scale)
    o.parent = gate_root
    o.location = t2b(lx, ly, lz)
    return o

# 1) 좌측(북쪽) 문주 기둥 1 (넓은 화강석 함체) + 보안 뱃지
gbox("GatePillarL1",  1.15, 2.05, 2.20, M_LIMESTONE, 0.0, 1.02, -7.8, bev=0.04)
gbox("GateCapL1",     1.24, 0.10, 2.30, M_COPING,    0.0, 2.08, -7.8, bev=0.02)
gbox("GateSecBadgeL", 0.06, 0.42, 0.42, M_HANDICAP, -0.60, 1.56, -8.35, bev=0.01)
gbox("GatePocketL1",  0.18, 1.55, 0.65, M_FRAME,    -0.52, 0.80, -7.25, bev=0.01)

# 2) 좌측 보행자 출입구 자바라 스테인리스 철문 (6단 수직 프레임 + 교차 바) + 노란 볼라드 3개
for gi in range(6):
    gz = -6.45 + gi * 0.34
    gbox("GateFoldPost", 0.08, 1.48, 0.08, M_RAIL, 0.0, 0.78, gz, bev=0.01)
gbox("GateFoldTop", 0.10, 0.08, 1.85, M_RAIL, 0.0, 1.48, -5.60, bev=0.01)
gbox("GateFoldMid", 0.10, 0.08, 1.85, M_RAIL, 0.0, 0.82, -5.60, bev=0.01)
gbox("GateFoldBot", 0.10, 0.08, 1.85, M_RAIL, 0.0, 0.24, -5.60, bev=0.01)
# 보행자 진입로 적갈색 보도 포장 + 노란/검정 볼라드 3개
gbox("GateWalkPave", 7.8, 0.06, 2.6, M_SIDEWALK, 4.2, 0.04, -5.5, bev=0.0)
for bx in (2.2, 4.8, 7.4):
    o_b = add_cylinder("GateBollard", 0.08, 0.09, 0.78, M_YELLOW_LN, bx, 0.40, -6.6, segs=10)
    o_b.parent = gate_root
    o_b.location = t2b(bx, 0.40, -6.6)

# 3) 좌측 문주 기둥 2 (보행자 입구 / 차량 진입로 분리 기둥) + 안내 스티커
gbox("GatePillarL2",  1.10, 2.02, 1.25, M_LIMESTONE, 0.0, 1.01, -3.75, bev=0.04)
gbox("GateCapL2",     1.20, 0.10, 1.35, M_COPING,    0.0, 2.06, -3.75, bev=0.02)
gbox("GateNoticeL2",  0.05, 0.85, 0.65, M_WHITE,    -0.57, 1.32, -3.75, bev=0.01)

# 4) 중앙 차량 진입로 바닥 스테인리스 레일 (폭 9.6m)
gbox("GateFloorTrack", 0.56, 0.04, 10.2, M_RAIL, 0.0, 0.04, 1.6, bev=0.0)

# 5) 우측(남쪽) 화강석 담장 + 전면 브론즈 '경기북부병무지청' 동판 + 파란 보안 뱃지 + '전좌로 76' 주소판
gbox("GateWallR",     0.90, 2.15, 5.20, M_LIMESTONE, 0.0, 1.08, 9.2, bev=0.04, uv_scale=3.0)
gbox("GateCapR",      1.00, 0.10, 5.32, M_COPING,    0.0, 2.18, 9.2, bev=0.02)
gbox("GateSecBadgeR", 0.06, 0.44, 0.44, M_HANDICAP, -0.47, 1.56, 7.45, bev=0.01)
gbox("GateAddr76",    0.06, 0.36, 0.42, M_WHITE,    -0.47, 1.62, 11.15, bev=0.01)
# 우측 담장 서쪽 정면(전좌로 방향) 브론즈 동판 현판
sg = add_sign_plane("SignGatePlane", 1.85, 0.70, M_SIGN_GATE, -0.48, 1.12, 9.15, rot_y=-math.pi/2)
sg.parent = gate_root
sg.location = t2b(-0.48, 1.12, 9.15)
sg.rotation_euler = (0.0, 0.0, -math.pi/2)
# 우측 담장 뒤편 수직 안내 폴 + 우측 철제 펜스 연장
gbox("GateSignPylon", 0.16, 4.6, 0.95, M_FRAME,  1.2, 2.3, 8.8, bev=0.02)
gbox("GateFenceR",    0.08, 1.7, 5.5,  M_FENCE,  0.0, 0.85, 14.5, bev=0.0)

# =============================================================================
# 3. DXF 실측 건물 + PBR 석재/적벽돌 + 깊은 3D 창호 리세스 + 중공 파라펫 + 한글 현판
# =============================================================================
b_main   = dxf["buildings"][5]
b_annex  = dxf["buildings"][6]
b_bridge = dxf["buildings"][3]
b_canopy = dxf["buildings"][4]

# --- 본관동 (60.26 × 20.49m, 3F, PBR 석재 패널 + 중공 옥상 파라펫 + 깊은 창호 + 한글 현판) ---
extrude_dxf_poly("MainBldg",   b_main["pts"], 0.0,   12.6, M_LIMESTONE, bevel=0.06, uv_scale=4.5)
extrude_dxf_poly("MainBaseAO", b_main["pts"], 0.0,   0.32, M_CONTACT_AO, bevel=0.0)
extrude_dxf_poly("MainRoof",   b_main["pts"], 12.62, 0.08, M_ROOF_GRN,  bevel=0.0)
add_hollow_parapet("MainParapet", b_main["pts"], 12.6, 0.88, 0.55, M_LIMESTONE, uv_scale=4.0)

# 옥상 태양광 + 백색 옥탑 + 돔 + 철탑
for sx in range(-28, 22, 3):
    add_box("MainSolar", 2.6, 0.12, 2.2, M_SOLAR, sx, 13.05, -12.2, rot_x=0.25, bevel=0.02)
add_box("MainPenthouse", 6.2, 2.8, 5.2, M_LIMESTONE, -18.5, 14.0, -19.5, bevel=0.08, uv_scale=4.0)
add_cylinder("MainDome", 2.1, 2.1, 1.6, M_COPING, 1.5, 13.5, -22.5, segs=24)
for tx in (-15.0, 13.0):
    add_box("Tower", 0.28, 9.5, 0.28, M_RAIL, tx, 17.4, -17.0)

# 본관 남면·북면 깊은 3D 창호 (내부 블라인드/조명 유리 + 45cm 돌출 수직 석재 필라스터 + 돌출 슬래브 처마)
for wy in (2.5, 6.2, 9.8):
    add_box("MainWinS", 42.0, 1.85, 0.22, M_WINDOW, 3.0, wy, -8.88, uv_scale=3.2)
    add_box("MainWinN", 48.0, 1.85, 0.22, M_WINDOW, -5.0, wy, -28.75, uv_scale=3.2)
    # 상·하부 창대(Sill/Header) 돌출 몰딩 -> 깊은 그림자 형성!
    add_box("MainSillS", 42.4, 0.16, 0.56, M_COPING, 3.0, wy - 0.96, -8.72, bevel=0.02)
    add_box("MainHeadS", 42.4, 0.18, 0.56, M_COPING, 3.0, wy + 0.96, -8.72, bevel=0.02)
for sy in (4.35, 8.0):
    add_box("MainSpanS", 42.0, 1.35, 0.42, M_SPANDREL, 3.0, sy, -8.78, bevel=0.03)
for mx in range(-17, 24, 3):
    # 깊은 돌출 수직 멀리언 + 6m마다 두꺼운 석재 기둥(Pilaster)
    if (mx + 17) % 6 == 0:
        add_box("MainPierS", 0.42, 11.2, 0.62, M_LIMESTONE, mx, 6.2, -8.68, bevel=0.03, uv_scale=4.0)
    else:
        add_box("MainMulS", 0.16, 9.8, 0.52, M_FRAME, mx, 6.2, -8.72, bevel=0.02)

# 본관 남면 상단 한글 현판 ("경기북부병무지청")
add_sign_plane("SignMainPlane", 16.5, 2.2, M_SIGN_MAIN, 3.0, 12.15, -8.52, rot_y=0.0)

# 360° 꽉 찬 노란 원통형 로비 + 캔틸레버 포털
add_cylinder("YellowAtrium", 5.8, 5.2, 9.8, M_YELLOW, -25.5, 4.9, -9.8, segs=36)
add_cylinder("AtriumGlass",  5.88, 5.5, 3.4, M_WINDOW, -25.5, 4.9, -9.7, segs=36)
add_box("AtriumRoof", 16.5, 1.8, 8.2, M_LIMESTONE, -25.2, 11.7, -8.0, bevel=0.08, uv_scale=4.0)
add_box("AtriumPier", 1.8, 11.2, 2.2, M_LIMESTONE, -32.4, 5.6, -5.0, bevel=0.08, uv_scale=4.0)

# 남쪽 유리 현관 캐노피 & 3층 통유리 구름다리
extrude_dxf_poly("MainCanopy",     b_canopy["pts"], 0.0, 3.3, M_WINDOW, bevel=0.04, uv_scale=3.0)
extrude_dxf_poly("MainCanopyTop",  b_canopy["pts"], 3.3, 0.28, M_COPING, bevel=0.04)
extrude_dxf_poly("SkybridgeGlass", b_bridge["pts"], 7.6, 3.4, M_WINDOW, bevel=0.03, uv_scale=3.0)
extrude_dxf_poly("SkybridgeBot",   b_bridge["pts"], 7.3, 0.38, M_COPING, bevel=0.04)
extrude_dxf_poly("SkybridgeTop",   b_bridge["pts"], 10.9, 0.42, M_COPING, bevel=0.04)

# --- 징병검사동 / 별관동 (36.24 × 22.61m, 하부 PBR 적벽돌 1F + 상부 PBR 석재 2~4F + 중공 파라펫 + 현판 4종) ---
extrude_dxf_poly("AnnexB1Brick", b_annex["pts"], LOW_Y, -LOW_Y, M_BRICK, bevel=0.04, uv_scale=3.0)
extrude_dxf_poly("AnnexMain",    b_annex["pts"], 0.0,   12.6,   M_LIMESTONE, bevel=0.06, uv_scale=4.5)
extrude_dxf_poly("AnnexRoof",    b_annex["pts"], 12.62, 0.08,   M_ROOF_GRN, bevel=0.0)
add_hollow_parapet("AnnexParapet", b_annex["pts"], 12.6, 0.85, 0.55, M_LIMESTONE, uv_scale=4.0)

# 북서 통유리 계단탑
add_box("AnnexTower",  5.2, 14.4, 5.2, M_LIMESTONE, 12.0, 7.2, 8.2, bevel=0.08, uv_scale=4.0)
add_box("AnnexTowerG", 0.35, 12.0, 3.8, M_WINDOW,   9.35, 6.8, 8.2, uv_scale=3.2)

# 실제 병역판정검사장 상부 주출입구 (DXF 오목 베이 x=9.58..18.53, z=20.1 정확 정렬!)
# 1) 광장에서 검사장 입구로 이어지는 흰색 타일 경사로 + 양쪽 스테인리스 난간 + 넓은 진입 테라스
add_box("ExamRampDeck", 7.8, 0.28, 3.0, M_COPING, 6.2, 0.28, 23.0, rot_z=0.055, bevel=0.02)
add_box("ExamLanding",  9.2, 0.54, 4.6, M_COPING, 14.1, 0.27, 22.3, bevel=0.02)
for rz_off in (-1.38, 1.38):
    add_box("ExamRampBar1", 7.8, 0.045, 0.045, M_RAIL, 6.2, 1.16, 23.0 + rz_off, rot_z=0.055)
    add_box("ExamRampBar2", 7.8, 0.04,  0.04,  M_RAIL, 6.2, 0.78, 23.0 + rz_off, rot_z=0.055)
    for rx_p in (2.6, 4.4, 6.2, 8.0, 9.8):
        add_box("ExamRampPost", 0.05, 0.92, 0.05, M_RAIL, rx_p, 0.70 + (rx_p - 2.6) * 0.055, 23.0 + rz_off)
# 2) 좌측 적벽돌 필로티 벽 + 벤치 2개 + 회색 원기둥 2개 (x=9.8..14.0, z=20.2)
add_box("ExamPilotiBrick", 4.1, 3.1, 0.28, M_BRICK, 11.9, 2.08, 20.22, uv_scale=2.5)
add_box("ExamBench1", 1.35, 0.44, 0.44, M_WOOD, 11.1, 0.76, 20.68, bevel=0.02)
add_box("ExamBench2", 1.35, 0.44, 0.44, M_WOOD, 12.8, 0.76, 20.68, bevel=0.02)
add_cylinder("ExamColL", 0.22, 0.22, 3.25, M_COPING, 9.9,  2.14, 20.75, segs=16)
add_cylinder("ExamColR", 0.22, 0.22, 3.25, M_COPING, 14.0, 2.14, 20.75, segs=16)
# 3) 우측 4짝 유리 자동문 + 파란 상단 띠 + 금색 "병역판정검사장" 현판 (x=14.3..18.3, z=20.15)
add_box("ExamDoorGlass",  4.0, 2.85, 0.22, M_WINDOW,   16.3, 1.96, 20.18, uv_scale=2.5)
add_box("ExamDoorHeader", 4.1, 0.46, 0.30, M_HANDICAP, 16.3, 3.22, 20.24, bevel=0.02)
for dx_m in (14.3, 15.3, 16.3, 17.3, 18.3):
    add_box("ExamDoorMul", 0.08, 2.90, 0.30, M_FRAME, dx_m, 1.96, 20.25)
add_sign_plane("SignExamGoldPlane", 4.2, 0.78, M_SIGN_EXAM_G, 16.3, 4.05, 20.34, rot_y=0.0)

# 옥상 4열 태양광
for rz in (3.0, 7.2, 11.4, 15.6):
    for rx in range(18, 41, 4):
        add_box("AnnexSolar", 2.8, 0.12, 2.0, M_SOLAR, rx, 13.05, rz, rot_x=0.25, bevel=0.02)

# 남측 11-bay 깊은 입체 커튼월 + 돌출 창대/기둥 + 민원실 유리 현관 + 한글 현판
add_box("AnnexSouthCW", 22.0, 5.4, 0.22, M_WINDOW, 33.8, 8.6, 21.28, uv_scale=3.2)
add_box("AnnexSouthSp", 22.0, 1.2, 0.46, M_SPANDREL, 33.8, 8.5, 21.36, bevel=0.03)
add_box("AnnexSillTop", 22.6, 0.20, 0.62, M_COPING, 33.8, 11.35, 21.42, bevel=0.02)
add_box("AnnexSillBot", 22.6, 0.20, 0.62, M_COPING, 33.8, 5.85,  21.42, bevel=0.02)
for mx in range(23, 46, 2):
    add_box("AnnexMulS", 0.16, 5.5, 0.54, M_FRAME, mx, 8.6, 21.40, bevel=0.02)
for cx in (25.5, 33.5, 41.2):
    add_box("Annex2FW",     6.8, 2.6, 0.22, M_WINDOW, cx, 2.1, 21.28, uv_scale=3.0)
    add_box("Annex2FSill",  7.1, 0.18, 0.52, M_COPING, cx, 0.78, 21.40, bevel=0.02)
    add_box("Annex2FHead",  7.1, 0.18, 0.52, M_COPING, cx, 3.42, 21.40, bevel=0.02)
add_box("MinwonCanopy", 4.8, 3.0, 1.5, M_WINDOW, 32.5, LOW_Y + 1.5, 22.0, bevel=0.04, uv_scale=2.5)
add_box("MinwonCap",    5.2, 0.55, 1.7, M_HANDICAP, 32.5, LOW_Y + 3.15, 22.0, bevel=0.04)

# 별관 남면 한글 현판: 민원실/군지원센터 + 세로 "병역판정검사장" + 슬로건 현수막
add_sign_plane("SignMinwonPlane", 5.2, 0.95, M_SIGN_MINWON, 32.5, LOW_Y + 3.15, 22.92, rot_y=0.0)
add_sign_plane("SignAnnexVPlane", 1.35, 8.2, M_SIGN_ANN_V,  19.8, 6.8, 21.45, rot_y=0.0)
add_sign_plane("SignSloganPlane", 9.6, 2.25, M_SIGN_SLOGAN, 33.8, 4.55, 21.45, rot_y=0.0)

# 동측 4×4 계단 커튼월 + 한글 "경기북부 병무청" 현판
add_box("AnnexEastCW",  0.22, 6.2, 7.6, M_WINDOW, 45.62, 8.5, 6.2, uv_scale=3.2)
for ez in (3.0, 5.2, 7.4, 9.6):
    add_box("AnnexEastMul", 0.48, 6.3, 0.16, M_FRAME, 45.74, 8.5, ez, bevel=0.02)
add_box("AnnexEast2F",  0.22, 2.5, 16.5, M_WINDOW, 45.62, 1.9, 11.2, uv_scale=3.2)
add_sign_plane("SignAnnexEastPlane", 4.6, 2.8, M_SIGN_ANN_E, 45.82, 9.2, 15.6, rot_y=math.pi/2)

# 부속건물 (파란 지붕 차고 2동 + 동쪽 부속시설 + 목재 정자)
for bi in (2, 8):
    extrude_dxf_poly(f"Carport_{bi}",  dxf["buildings"][bi]["pts"], 0.0, 3.0, M_LIMESTONE, bevel=0.05, uv_scale=4.0)
    extrude_dxf_poly(f"CarportR_{bi}", dxf["buildings"][bi]["pts"], 3.0, 0.28, M_ROOF_BLU, bevel=0.04)
extrude_dxf_poly("UtilE", dxf["buildings"][0]["pts"], LOW_Y, 3.2, M_LIMESTONE, bevel=0.05, uv_scale=4.0)
add_box("GazeboBase", 3.4, 0.35, 3.4, M_WOOD, 36.0, LOW_Y + 2.2, -16.5, bevel=0.04)
for gx, gz in ((-1.4,-1.4),(1.4,-1.4),(-1.4,1.4),(1.4,1.4)):
    add_box("GazeboP", 0.16, 2.6, 0.16, M_WOOD, 36.0 + gx, LOW_Y + 3.5, -16.5 + gz)
add_cylinder("GazeboRoof", 0.15, 2.8, 1.3, M_FRAME, 36.0, LOW_Y + 5.4, -16.5, segs=4, rot_y=math.pi/4)

# =============================================================================
# 4. 주차장 (동쪽 풀 10면 아일랜드 + 북쪽 주차장) & 알파-컷아웃 잔잎 수목
# =============================================================================
add_box("IslCurbN", 26.2, 0.18, 0.45, M_COPING, 64.75, LOW_Y + 0.09, 4.0, bevel=0.03)
build_parking_row_ns(52.0, LOW_Y, 1.2,  10, direction='south', cars=(1, 3, 5, 8))
build_parking_row_ns(52.0, LOW_Y, 6.8,  10, direction='north', cars=(2, 4, 6, 9), handicap=(0, 1))
add_box("IslCurbS", 26.2, 0.18, 0.65, M_GRASS, 64.75, LOW_Y + 0.09, 21.9, bevel=0.03, uv_scale=4.0)
build_parking_row_ns(52.0, LOW_Y, 19.1, 10, direction='south', cars=(1, 3, 6, 8))
build_parking_row_ns(52.0, LOW_Y, 24.7, 10, direction='north', cars=(0, 2, 5, 7, 9))
build_parking_row_ns(46.5, LOW_Y, -11.2, 10, direction='north', cars=(0, 1, 2, 4, 6, 8))
build_parking_row_ns(52.0, LOW_Y, 37.8,  6,  direction='south', cars=(3, 5), handicap=(0, 1))

add_box("TennisCourt", 21.0, 0.14, 15.0, M_TENNIS, -32.5, 0.07, -43.5)
build_parking_col_ew(-16.5, 0.0, -51.0, 5, direction='west', cars=(0, 1, 2, 3))
build_parking_col_ew(-4.5,  0.0, -53.0, 6, direction='east', cars=(0, 1, 3, 4))
build_parking_col_ew(0.8,   0.0, -50.5, 5, direction='west', cars=(1, 2, 3))
build_parking_col_ew(10.5,  0.0, -48.0, 4, direction='east', cars=(0, 1, 2))

# 실사 다분기 잔잎/솔잎 수목 배치 (소나무 섬 + 동쪽 단풍/그늘나무 + 주변 조경)
trees = [
    (-20.5, 0.42, 17.5, 7.6, 'pine', 1), (-18.5, 0.42, 11.2, 8.4, 'pine', 2), (-20.0, 0.42, 5.5, 7.2, 'pine', 3),
    (-9.5,  0.42, 17.0, 8.0, 'pine', 4), (-7.8,  0.42, 10.8, 8.6, 'pine', 5), (-9.2,  0.42, 5.2, 7.0, 'pine', 6),
    (5.8,  0.10, 19.6, 3.4, 'pine', 7), (8.2,  0.10, 19.8, 3.2, 'pine', 8),
    (60.5, LOW_Y, 21.9, 5.6, 'maple', 9), (70.0, LOW_Y, 21.9, 5.8, 'oak', 10),
    (49.5, LOW_Y, 13.0, 5.4, 'maple', 11), (78.5, LOW_Y, 6.0, 6.6, 'pine', 12),
    # 외곽 녹지대 자연 수림 (콜로세움 조감도 같은 풍성한 주변 수목 실루엣!)
    (91.0, LOW_Y, -5.0, 8.2, 'oak', 13), (92.0, LOW_Y, 12.0, 7.8, 'pine', 14),
    (90.5, LOW_Y, 28.0, 8.0, 'maple', 15), (72.0, LOW_Y, -22.0, 8.5, 'pine', 16),
    (54.0, LOW_Y, -21.0, 7.5, 'oak', 17), (-38.0, 0.0, -69.0, 8.4, 'pine', 18),
    (-14.0, 0.0, -70.0, 8.8, 'oak', 19), (12.0, 0.0, -69.5, 8.0, 'maple', 20),
]
for tx, ty, tz, th, tk, ts in trees:
    add_realistic_tree(tx, ty, tz, th, tk, ts)

# 전좌로 인도 가로수 (도로 각도 +0.310 rad 정확 변환!)
ca, sa = math.cos(0.310), math.sin(0.310)
for i, lz in enumerate(range(-48, 15, 9)):
    lx = 8.2
    wx = -48.2 + lx * ca + lz * sa
    wz =   5.5 - lx * sa + lz * ca
    wy =   0.55 - lz * 0.022
    add_realistic_tree(wx, wy, wz, 6.6, 'oak', 30 + i)

# =============================================================================
# 4.5 주변 자연 배경 (전좌로 가로등 · 외곽 숲 · 도봉산 산능선 — 주변 임의 건물 제거!)
# =============================================================================
M_MTN_FAR   = get_mat("Env_Mountain", (72,  102, 74),  roughness=0.95)
M_POLE      = get_mat("Env_Pole",     (96,  104, 114), roughness=0.35, metallic=0.82)
M_LAMP_GLOW = get_mat("Env_Lamp",     (255, 246, 224), roughness=0.15)

# 전좌로 가로등 (정문 진출입구 구간 10..36 제외!)
for lz in range(-60, 65, 18):
    if 10 <= lz <= 36:
        continue
    lx = 6.4
    wx = -48.2 + lx * ca + lz * sa
    wz =   5.5 - lx * sa + lz * ca
    wy =   0.55 - lz * 0.022
    add_box("StreetPole", 0.16, 7.2, 0.16, M_POLE, wx, wy + 3.6, wz, rot_y=0.310)
    add_box("StreetArm",  1.8,  0.12, 0.12, M_POLE, wx - 0.8 * ca, wy + 7.1, wz + 0.8 * sa, rot_y=0.310)
    add_box("StreetLamp", 0.55, 0.14, 0.28, M_LAMP_GLOW, wx - 1.5 * ca, wy + 7.0, wz + 1.5 * sa, rot_y=0.310)

# 외곽 수림 인스턴싱 (가볍게 40그루)
tree_woods = [o for o in bpy.data.objects if o.name.startswith("TreeWood_")]
tree_leafs = [o for o in bpy.data.objects if o.name.startswith("TreeLeaf_")]
if tree_woods and tree_leafs:
    rng_t = random.Random(2026)
    for i in range(45):
        ang = rng_t.uniform(-math.pi * 0.85, math.pi * 0.85)
        rad = rng_t.uniform(92, 165)
        px = 18 + math.cos(ang) * rad
        pz = -5 + math.sin(ang) * rad
        if -58 < px < 88 and -68 < pz < 46:
            continue
        idx = i % min(len(tree_woods), len(tree_leafs))
        sc = rng_t.uniform(0.85, 1.40)
        rz = rng_t.uniform(0, math.pi * 2)
        for src in (tree_woods[idx], tree_leafs[idx]):
            inst = bpy.data.objects.new(f"EnvTree_{i}_{src.name}", src.data)
            scene.collection.objects.link(inst)
            inst.location = t2b(px, LOW_Y, pz)
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

# =============================================================================
# 5. GLB 내보내기 (v3.0: PBR + 노멀맵 + 알파 컷아웃 + 호원동 360° 주변 도시)
# =============================================================================
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format='GLB',
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT',
    export_image_format='AUTO',
)
print("SUCCESSFULLY EXPORTED v3.0 PBR+CITY GLB:", OUT_GLB)

# =============================================================================
# 6. Cycles 물리 하늘 360° 환경맵 렌더링 (Three.js 유리 반사 + 배경용, 2초 소요)
# =============================================================================
sky_env_path = os.path.join(PBR_DIR, "cycles_sky_env.jpg")
# 빈 씬에서 순수 물리 하늘만 초고속 렌더링
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 4
world = bpy.data.worlds.new("SkyEnvOnly")
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
    ("sun_size", math.radians(0.8)),
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
try:
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass
scene.view_settings.exposure = -0.80
cam_d = bpy.data.cameras.new("EnvCam")
cam_d.type = 'PANO'
if hasattr(cam_d, "panorama_type"):
    cam_d.panorama_type = 'EQUIRECTANGULAR'
cam_o = bpy.data.objects.new("EnvCam", cam_d)
scene.collection.objects.link(cam_o)
scene.camera = cam_o
cam_o.rotation_euler = (math.pi / 2.0, 0.0, 0.0)
scene.render.resolution_x = 1024
scene.render.resolution_y = 512
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 92
scene.render.filepath = sky_env_path
bpy.ops.render.render(write_still=True)
print("EXPORTED CYCLES SKY ENV:", sky_env_path)
