#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
こだわりおすすめナビ / 体験・旅行のおすすめ特集
ヒーロー（トップ画）用 SVG イラストレーション生成器  v2

コンセプト: ひとつの旅の風景のなかに、いろいろな旅行者のセグメントがいる。
  3世代 / 子連れファミリー / 赤ちゃん連れ / カップル / ママ友グループ / ペット連れ
背景: 温泉宿・露天風呂 / プール・スライダー / 観覧車 / 新幹線 / 紅葉の丘 / 山
"""
import math, random

W, H = 1920, 800

C = dict(
    sky_top="#FFD7A2", sky_mid="#FFE7C6", sky_low="#FFF3E0",
    sun="#FFB45C", cloud="#FFFFFF",
    mtn_far="#AEC0DC", mtn_far2="#C2D0E8", mtn_snow="#F4F8FD",
    hillA="#9AC7AE", hillB="#7FB79B", hillC="#66A487", hillD="#8FC4A2",
    autumn1="#E8845C", autumn2="#F2A65A", autumn3="#D9634B",
    roof="#6A5A72", roof2="#83707C", wall="#FFF7EC", window="#FFC96A",
    onsen="#8FC9DE", onsen2="#B6E0EC", steam="#FFFFFF",
    wheel2="#FFFFFF", wheel="#F2A65A", wheel_hub="#E0784C",
    train="#FDFDFD", train_line="#2F6497", train_win="#8FD0E8",
    viaduct="#CFC4B2",
    pool="#7FC6E0", pool2="#A8DAEC", pool3="#C8E8F4",
    slide="#F2874E", slide2="#FFB27A",
    grass="#93C8A6", grass2="#7CB891", grass3="#6AA981",
    path="#EFDFC2",
    ink="#34454F",
)
SKIN = ["#F6D3B6", "#EBBE9B", "#D6A279", "#C08B62"]
TOPS = ["#E8705F", "#F2B04C", "#5C8CB5", "#7BAE7F", "#C46F9E", "#4D6B8A", "#EE9C6A", "#6FB6B0"]
BOTS = ["#3F5A72", "#53687E", "#7A5E6E", "#46685C", "#6B5B73"]
HAIR = ["#3B2F2A", "#54403A", "#2E2724", "#6B4F42"]

rnd = random.Random(20260913)
out = []
def add(s): out.append(s)


# ----------------------------------------------------------------- person
def person(x, gy, s=1.0, top=None, bot=None, skin=None, hair=None,
           arm="down", hair_style="short", hat=None, kid=False, flip=False):
    """s=1.0 で身長およそ118px。gy は足元。"""
    top = top or rnd.choice(TOPS); bot = bot or rnd.choice(BOTS)
    skin = skin or rnd.choice(SKIN); hair = hair or rnd.choice(HAIR)
    hr, body_h, leg_h, body_w = 13.0*s, 40.0*s, 34.0*s, 25.0*s
    if kid: hr, body_h, leg_h, body_w = 11.2*s, 26*s, 20*s, 20*s

    g = [f'<g transform="translate({x:.1f},{gy:.1f})' + (' scale(-1,1)' if flip else '') + '">']
    lw = body_w*0.30
    for sx in (-body_w*0.30, body_w*0.30):
        g.append(f'<rect x="{sx-lw/2:.1f}" y="{-leg_h:.1f}" width="{lw:.1f}" height="{leg_h:.1f}" rx="{lw/2:.1f}" fill="{bot}"/>')
    # shoes
    for sx in (-body_w*0.30, body_w*0.30):
        g.append(f'<rect x="{sx-lw*0.72:.1f}" y="{-lw*0.62:.1f}" width="{lw*1.44:.1f}" height="{lw*0.62:.1f}" rx="{lw*0.3:.1f}" fill="#3A4650"/>')
    by = -leg_h - body_h
    g.append(f'<rect x="{-body_w/2:.1f}" y="{by:.1f}" width="{body_w:.1f}" height="{body_h+lw*0.4:.1f}" rx="{body_w*0.42:.1f}" fill="{top}"/>')
    aw = body_w*0.24
    if arm == "up":
        sh_x, sh_y = body_w*0.36+aw/2, by+body_h*0.16
        g.append(f'<g transform="rotate(20 {sh_x:.1f} {sh_y:.1f})">'
                 f'<rect x="{body_w*0.36:.1f}" y="{by-body_h*0.72:.1f}" width="{aw:.1f}" height="{body_h*0.90:.1f}" rx="{aw/2:.1f}" fill="{top}"/></g>')
        g.append(f'<circle cx="{body_w*0.36+aw/2+body_h*0.30:.1f}" cy="{by-body_h*0.62:.1f}" r="{aw*0.62:.1f}" fill="{skin}"/>')
        g.append(f'<rect x="{-body_w*0.40-aw:.1f}" y="{by+body_h*0.14:.1f}" width="{aw:.1f}" height="{body_h*0.80:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
    elif arm == "hold":
        g.append(f'<rect x="{body_w*0.34:.1f}" y="{by+body_h*0.46:.1f}" width="{body_h*0.72:.1f}" height="{aw:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
        g.append(f'<circle cx="{body_w*0.34+body_h*0.72:.1f}" cy="{by+body_h*0.46+aw/2:.1f}" r="{aw*0.58:.1f}" fill="{skin}"/>')
        g.append(f'<rect x="{-body_w*0.40-aw:.1f}" y="{by+body_h*0.14:.1f}" width="{aw:.1f}" height="{body_h*0.80:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
    elif arm == "holdL":
        g.append(f'<rect x="{-body_w*0.34-body_h*0.72:.1f}" y="{by+body_h*0.46:.1f}" width="{body_h*0.72:.1f}" height="{aw:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
        g.append(f'<circle cx="{-body_w*0.34-body_h*0.72:.1f}" cy="{by+body_h*0.46+aw/2:.1f}" r="{aw*0.58:.1f}" fill="{skin}"/>')
        g.append(f'<rect x="{body_w*0.40:.1f}" y="{by+body_h*0.14:.1f}" width="{aw:.1f}" height="{body_h*0.80:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
    elif arm == "push":
        g.append(f'<rect x="{body_w*0.34:.1f}" y="{by+body_h*0.30:.1f}" width="{body_h*0.60:.1f}" height="{aw:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
        g.append(f'<rect x="{body_w*0.34:.1f}" y="{by+body_h*0.52:.1f}" width="{body_h*0.52:.1f}" height="{aw:.1f}" rx="{aw/2:.1f}" fill="{top}" opacity="0.85"/>')
    else:
        for sx in (body_w*0.40, -body_w*0.40-aw):
            g.append(f'<rect x="{sx:.1f}" y="{by+body_h*0.14:.1f}" width="{aw:.1f}" height="{body_h*0.80:.1f}" rx="{aw/2:.1f}" fill="{top}"/>')
    hy = by - hr*0.84
    g.append(f'<rect x="{-hr*0.26:.1f}" y="{by-hr*0.5:.1f}" width="{hr*0.52:.1f}" height="{hr*0.7:.1f}" fill="{skin}"/>')
    g.append(f'<circle cx="0" cy="{hy:.1f}" r="{hr:.1f}" fill="{skin}"/>')
    if hair_style == "bun":
        g.append(f'<circle cx="{-hr*0.95:.1f}" cy="{hy-hr*0.60:.1f}" r="{hr*0.40:.1f}" fill="{hair}"/>')
        g.append(f'<path d="M {-hr:.1f} {hy+hr*0.06:.1f} A {hr:.1f} {hr:.1f} 0 0 1 {hr:.1f} {hy+hr*0.06:.1f} L {hr*0.88:.1f} {hy-hr*0.06:.1f} L {-hr*0.88:.1f} {hy-hr*0.06:.1f} Z" fill="{hair}"/>')
    elif hair_style == "long":
        g.append(f'<path d="M {-hr*1.08:.1f} {hy+hr*0.30:.1f} L {-hr*1.08:.1f} {hy-hr*0.10:.1f} '
                 f'A {hr*1.08:.1f} {hr*1.08:.1f} 0 0 1 {hr*1.08:.1f} {hy-hr*0.10:.1f} '
                 f'L {hr*1.08:.1f} {hy+hr*0.30:.1f} L {hr*0.66:.1f} {hy+hr*0.30:.1f} '
                 f'L {hr*0.66:.1f} {hy-hr*0.16:.1f} L {-hr*0.66:.1f} {hy-hr*0.16:.1f} '
                 f'L {-hr*0.66:.1f} {hy+hr*0.30:.1f} Z" fill="{hair}"/>')
    elif hair_style == "gray":
        g.append(f'<path d="M {-hr:.1f} {hy-hr*0.02:.1f} A {hr:.1f} {hr:.1f} 0 0 1 {hr:.1f} {hy-hr*0.02:.1f} L {hr*0.9:.1f} {hy-hr*0.24:.1f} L {-hr*0.9:.1f} {hy-hr*0.24:.1f} Z" fill="#D9D4CE"/>')
    else:
        g.append(f'<path d="M {-hr:.1f} {hy-hr*0.02:.1f} A {hr:.1f} {hr:.1f} 0 0 1 {hr:.1f} {hy-hr*0.02:.1f} L {hr*0.9:.1f} {hy-hr*0.24:.1f} L {-hr*0.9:.1f} {hy-hr*0.24:.1f} Z" fill="{hair}"/>')
    if hat:
        g.append(f'<path d="M {-hr*0.86:.1f} {hy-hr*0.46:.1f} q 0 {-hr*0.96:.1f} {hr*0.86:.1f} {-hr*0.96:.1f} q {hr*0.86:.1f} 0 {hr*0.86:.1f} {hr*0.96:.1f} Z" fill="{hat}"/>')
        g.append(f'<ellipse cx="0" cy="{hy-hr*0.44:.1f}" rx="{hr*1.60:.1f}" ry="{hr*0.26:.1f}" fill="{hat}"/>')
    g.append('</g>')
    add("".join(g))


def tree_round(x, gy, s=1.0, col="#66A487", trunk="#8A6A52"):
    tw, th = 7*s, 20*s
    add(f'<rect x="{x-tw/2:.1f}" y="{gy-th:.1f}" width="{tw:.1f}" height="{th:.1f}" rx="{tw/2:.1f}" fill="{trunk}"/>')
    add(f'<circle cx="{x:.1f}" cy="{gy-th-15*s:.1f}" r="{19*s:.1f}" fill="{col}"/>')
    add(f'<circle cx="{x-14*s:.1f}" cy="{gy-th-5*s:.1f}" r="{12.5*s:.1f}" fill="{col}"/>')
    add(f'<circle cx="{x+14*s:.1f}" cy="{gy-th-6*s:.1f}" r="{13.5*s:.1f}" fill="{col}"/>')


def tree_pine(x, gy, s=1.0, col="#4E8E72"):
    add(f'<rect x="{x-3*s:.1f}" y="{gy-13*s:.1f}" width="{6*s:.1f}" height="{13*s:.1f}" fill="#7A5E48"/>')
    for wd, yy in [(24, 13), (19, 28), (13, 42)]:
        add(f'<path d="M {x-wd*s:.1f} {gy-yy*s:.1f} L {x:.1f} {gy-(yy+21)*s:.1f} L {x+wd*s:.1f} {gy-yy*s:.1f} Z" fill="{col}"/>')




def tent(x, gy, s=1.0, c="#F5EDE0", c2="#E2D3BC"):
    add(f'<g transform="translate({x},{gy}) scale({s})">')
    add(f'<path d="M 0 0 L 44 -74 L 88 0 Z" fill="{c}"/>')
    add(f'<path d="M 44 -74 L 88 0 L 62 0 Z" fill="{c2}"/>')
    add(f'<path d="M 44 -74 L 60 0 L 30 0 Z" fill="#8FB8C9"/>')
    add(f'<path d="M 44 -74 L 44 -80" stroke="#B9A88F" stroke-width="3"/>')
    add(f'<circle cx="44" cy="-82" r="4" fill="#F2A65A"/>')
    add(f'<rect x="-30" y="-8" width="18" height="8" rx="4" fill="#C08A52"/>')
    add(f'<path d="M -21 -10 q -5 -10 0 -18 q 5 8 0 18" fill="#F2874E" opacity="0.9"/>')
    add('</g>')

_bc = [0]
def balloon(x, y, s=1.0, c1="#E8705F", c2="#F2B04C", c3="#FFFFFF"):
    _bc[0] += 1; cid = f"bal{_bc[0]}"
    r = 44*s
    add(f'<clipPath id="{cid}"><circle cx="0" cy="0" r="{r:.1f}"/></clipPath>')
    add(f'<g transform="translate({x},{y})">')
    add(f'<circle cx="0" cy="0" r="{r:.1f}" fill="{c3}"/>')
    add(f'<g clip-path="url(#{cid})">')
    add(f'<ellipse cx="{-r*0.60:.1f}" cy="0" rx="{r*0.30:.1f}" ry="{r*1.1:.1f}" fill="{c1}"/>')
    add(f'<ellipse cx="{ r*0.60:.1f}" cy="0" rx="{r*0.30:.1f}" ry="{r*1.1:.1f}" fill="{c1}"/>')
    add(f'<ellipse cx="0" cy="0" rx="{r*0.26:.1f}" ry="{r*1.1:.1f}" fill="{c2}"/>')
    add('</g>')
    add(f'<path d="M {-r*0.78:.1f} {r*0.62:.1f} Q 0 {r*1.46:.1f} {r*0.78:.1f} {r*0.62:.1f} '
        f'Q 0 {r*1.02:.1f} {-r*0.78:.1f} {r*0.62:.1f} Z" fill="{c1}" opacity="0.92"/>')
    add(f'<path d="M {-r*0.16:.1f} {r*1.22:.1f} L {-r*0.20:.1f} {r*1.62:.1f} '
        f'M {r*0.16:.1f} {r*1.22:.1f} L {r*0.20:.1f} {r*1.62:.1f}" stroke="#B0A18A" stroke-width="{2.0*s:.1f}" fill="none"/>')
    add(f'<rect x="{-r*0.26:.1f}" y="{r*1.58:.1f}" width="{r*0.52:.1f}" height="{r*0.34:.1f}" rx="{r*0.07:.1f}" fill="#C08A52"/>')
    add('</g>')

def parasol(x, gy, s=1.0, c1="#E8705F", c2="#FFFFFF"):
    add(f'<rect x="{x-2.8*s:.1f}" y="{gy-78*s:.1f}" width="{5.6*s:.1f}" height="{78*s:.1f}" rx="{2.8*s:.1f}" fill="#C9B79C"/>')
    add(f'<path d="M {x-52*s:.1f} {gy-76*s:.1f} q {52*s:.1f} {-38*s:.1f} {104*s:.1f} 0 Z" fill="{c2}"/>')
    add(f'<path d="M {x-52*s:.1f} {gy-76*s:.1f} q {26*s:.1f} {-19*s:.1f} {52*s:.1f} {-19*s:.1f} L {x:.1f} {gy-76*s:.1f} Z" fill="{c1}"/>')
    add(f'<path d="M {x+26*s:.1f} {gy-95*s:.1f} q {26*s:.1f} {7*s:.1f} {26*s:.1f} {19*s:.1f} L {x+26*s:.1f} {gy-76*s:.1f} Z" fill="{c1}"/>')


# ================================================================= DEFS / SKY
add(f'''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="{C['sky_top']}"/><stop offset="60%" stop-color="{C['sky_mid']}"/><stop offset="100%" stop-color="{C['sky_low']}"/>
</linearGradient>
<linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="{C['grass']}"/><stop offset="100%" stop-color="{C['grass3']}"/>
</linearGradient>
<radialGradient id="sunGlow"><stop offset="0%" stop-color="#FFD79A" stop-opacity="0.9"/><stop offset="100%" stop-color="#FFD79A" stop-opacity="0"/></radialGradient>
<clipPath id="fujiClip"><path d="M 545 452 L 925 452 L 760 232 Q 735 206 712 232 Z"/></clipPath>
</defs>''')
add(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')

SX, SY = 1512, 236
add(f'<circle cx="{SX}" cy="{SY}" r="210" fill="url(#sunGlow)"/>')
add(f'<circle cx="{SX}" cy="{SY}" r="60" fill="{C["sun"]}" opacity="0.95"/>')

def cloud(x, y, s, op):
    add(f'<g opacity="{op}" fill="{C["cloud"]}">'
        f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{56*s:.0f}" ry="{19*s:.0f}"/>'
        f'<ellipse cx="{x-34*s:.0f}" cy="{y+5*s:.0f}" rx="{34*s:.0f}" ry="{14*s:.0f}"/>'
        f'<ellipse cx="{x+35*s:.0f}" cy="{y+6*s:.0f}" rx="{30*s:.0f}" ry="{12*s:.0f}"/>'
        f'<ellipse cx="{x+6*s:.0f}" cy="{y-15*s:.0f}" rx="{31*s:.0f}" ry="{17*s:.0f}"/></g>')
cloud(282, 118, 1.1, 0.7); cloud(742, 82, 0.8, 0.55)
cloud(1146, 150, 0.66, 0.5); cloud(1742, 104, 0.9, 0.6)
for bx, by, bs in [(742, 150, 1.0), (792, 128, 0.8), (830, 162, 0.68)]:
    add(f'<path d="M {bx:.0f} {by:.0f} q {7*bs:.1f} {-7*bs:.1f} {14*bs:.1f} 0 M {bx+14*bs:.0f} {by:.0f} q {7*bs:.1f} {-7*bs:.1f} {14*bs:.1f} 0" '
        f'stroke="#9CAAB6" stroke-width="{2.4*bs:.1f}" fill="none" stroke-linecap="round" opacity="0.75"/>')

# ================================================================= MOUNTAINS
balloon(1116, 168, 0.94)
balloon(1276, 248, 0.52, "#5C97C4", "#6FB6B0", "#FFFFFF")
add(f'<path d="M 0 456 L 180 456 L 372 296 L 428 328 L 498 272 L 690 456 Z" fill="{C["mtn_far2"]}"/>')
add(f'<path d="M 545 452 L 925 452 L 760 232 Q 735 206 712 232 Z" fill="{C["mtn_far"]}"/>')
add(f'<g clip-path="url(#fujiClip)"><path d="M 690 306 L 706 292 L 722 304 L 736 288 L 752 300 L 768 286 L 784 300 L 800 292 L 816 308 '
    f'L 826 340 L 690 340 Z" fill="{C["mtn_snow"]}"/></g>')
add(f'<path d="M 852 456 L 1236 456 L 1086 314 L 1024 352 L 954 310 Z" fill="{C["mtn_far2"]}"/>')
add(f'<path d="M 1196 456 L 1556 456 L 1414 326 L 1346 364 Z" fill="{C["mtn_far"]}" opacity="0.78"/>')
add(f'<path d="M 1512 456 L 1920 456 L 1920 336 L 1762 312 L 1638 378 Z" fill="{C["mtn_far2"]}"/>')

# ================================================================= HILL A（観覧車）
add(f'<path d="M 0 450 Q 320 390 660 426 Q 1020 450 1380 416 Q 1680 382 1920 416 L 1920 560 L 0 560 Z" fill="{C["hillA"]}"/>')

def ferris(cx, cy, r, base_y):
    add(f'<path d="M {cx-r*0.52:.0f} {base_y:.0f} L {cx:.0f} {cy:.0f} L {cx+r*0.52:.0f} {base_y:.0f}" stroke="#C6BAA6" stroke-width="10" fill="none" stroke-linecap="round"/>')
    add(f'<rect x="{cx-r*0.66:.0f}" y="{base_y-5:.0f}" width="{r*1.32:.0f}" height="9" rx="4" fill="#B9AC96"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{C["wheel2"]}" stroke-width="7"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r*0.60:.0f}" fill="none" stroke="{C["wheel2"]}" stroke-width="4" opacity="0.75"/>')
    for i in range(12):
        a = math.radians(i*30 - 90)
        x2, y2 = cx + r*math.cos(a), cy + r*math.sin(a)
        add(f'<line x1="{cx}" y1="{cy}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{C["wheel2"]}" stroke-width="3.2" opacity="0.88"/>')
        add(f'<circle cx="{x2:.1f}" cy="{y2:.1f}" r="{r*0.112:.1f}" fill="{C["wheel"] if i%2==0 else "#E8705F"}"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r*0.11:.0f}" fill="{C["wheel_hub"]}"/>')
ferris(1742, 350, 84, 468)

# ================================================================= HILL B（新幹線・紅葉）
add(f'<path d="M 0 556 Q 300 486 640 528 Q 980 570 1330 520 Q 1650 474 1920 516 L 1920 640 L 0 640 Z" fill="{C["hillB"]}"/>')

VY = 492
add(f'<rect x="1076" y="{VY}" width="520" height="14" rx="4" fill="{C["viaduct"]}"/>')
for px in range(1106, 1580, 80):
    add(f'<rect x="{px}" y="{VY+14}" width="16" height="{int(42 + (px-1106)*0.03)}" fill="{C["viaduct"]}" opacity="0.9"/>')
def shinkansen(x, y):
    g = [f'<g transform="translate({x},{y})">']
    g.append(f'<path d="M 0 0 h 200 v 26 h -236 q -18 0 -6 -15 Z" fill="{C["train"]}"/>')
    g.append(f'<path d="M -36 26 h 236 v 6 h -238 q -14 0 -12 -6 Z" fill="{C["train_line"]}"/>')
    g.append(f'<path d="M -22 7 q 15 -5 24 5 l -9 9 q -13 -3 -20 -5 Z" fill="{C["train_win"]}"/>')
    for i in range(7):
        g.append(f'<rect x="{24+i*24}" y="8" width="15" height="9" rx="3" fill="{C["train_win"]}"/>')
    g.append('</g>'); add("".join(g))
shinkansen(1188, VY-32)

for x, s, col in [(54, 1.10, C["autumn1"]), (146, 0.84, C["autumn2"]), (236, 1.20, C["autumn3"]),
                  (330, 0.92, C["autumn2"]), (420, 1.02, C["autumn1"])]:
    tree_round(x, 560 - x*0.045, s, col)
for x, s in [(196, 0.96), (286, 0.78), (376, 0.86)]:
    tree_pine(x, 564 - x*0.04, s)


# ================================================================= HILL C（温泉宿 / プール）
add(f'<path d="M 0 636 Q 360 594 720 618 Q 1120 646 1500 608 Q 1740 584 1920 606 L 1920 720 L 0 720 Z" fill="{C["hillC"]}"/>')

# --- 温泉宿＋露天風呂（左）
def ryokan(x, y, s=1.0):
    g = [f'<g transform="translate({x},{y}) scale({s})">']
    g.append(f'<rect x="0" y="0" width="200" height="66" rx="5" fill="{C["wall"]}"/>')
    g.append(f'<path d="M -20 4 L 100 -42 L 220 4 Z" fill="{C["roof"]}"/>')
    g.append(f'<path d="M -20 4 L 220 4 L 214 15 L -14 15 Z" fill="{C["roof2"]}"/>')
    for i in range(5):
        g.append(f'<rect x="{16+i*37}" y="26" width="24" height="21" rx="3" fill="{C["window"]}"/>')
    g.append(f'<rect x="0" y="58" width="200" height="8" fill="#EADBC6"/>')
    g.append(f'<rect x="80" y="44" width="40" height="14" rx="2" fill="#E8705F"/>')
    # 露天
    g.append(f'<ellipse cx="252" cy="60" rx="56" ry="19" fill="#6FAFC9"/>')
    g.append(f'<ellipse cx="252" cy="56" rx="56" ry="19" fill="{C["onsen"]}"/>')
    g.append(f'<ellipse cx="250" cy="55" rx="38" ry="11" fill="{C["onsen2"]}" opacity="0.7"/>')
    g.append(f'<ellipse cx="252" cy="56" rx="56" ry="19" fill="none" stroke="#A9997E" stroke-width="5"/>')
    for sx, sc in [(236, 1.0), (258, 1.32), (282, 0.9)]:
        g.append(f'<path d="M {sx} 40 q {-9*sc:.1f} {-16*sc:.1f} 0 {-29*sc:.1f} q {9*sc:.1f} {-13*sc:.1f} 0 {-26*sc:.1f}" '
                 f'stroke="{C["steam"]}" stroke-width="{7*sc:.1f}" fill="none" stroke-linecap="round" opacity="0.7"/>')
    g.append('</g>'); add("".join(g))
ryokan(84, 548, 1.0)

# --- プール＋スライダー（中央右）
def pool_area(x, y, s=1.0):
    g = [f'<g transform="translate({x},{y}) scale({s})">']
    g.append(f'<ellipse cx="120" cy="38" rx="142" ry="38" fill="#5FB2CE"/>')
    g.append(f'<ellipse cx="120" cy="32" rx="142" ry="38" fill="{C["pool2"]}"/>')
    g.append(f'<ellipse cx="112" cy="30" rx="98" ry="22" fill="{C["pool3"]}" opacity="0.7"/>')
    g.append(f'<ellipse cx="120" cy="32" rx="142" ry="38" fill="none" stroke="#F0E4CC" stroke-width="7"/>')
    # 監視台つきのスライダー塔
    g.append(f'<rect x="2" y="-92" width="22" height="96" rx="3" fill="#E6D7BC"/>')
    for i in range(5):
        g.append(f'<rect x="1" y="{-80+i*18}" width="24" height="5" rx="2.5" fill="#CDBB9C"/>')
    g.append(f'<rect x="-8" y="-106" width="46" height="15" rx="4" fill="{C["slide"]}"/>')
    g.append(f'<rect x="-8" y="-122" width="5" height="17" rx="2.5" fill="#E6D7BC"/>')
    g.append(f'<rect x="33" y="-122" width="5" height="17" rx="2.5" fill="#E6D7BC"/>')
    g.append(f'<rect x="-8" y="-124" width="46" height="5" rx="2.5" fill="#E6D7BC"/>')
    g.append(f'<path d="M 30 -88 q 56 18 44 58 q -10 38 44 52" stroke="{C["slide2"]}" stroke-width="26" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 30 -88 q 56 18 44 58 q -10 38 44 52" stroke="{C["slide"]}" stroke-width="13" fill="none" stroke-linecap="round"/>')
    g.append(f'<ellipse cx="120" cy="26" rx="26" ry="8" fill="#FFFFFF" opacity="0.75"/>')
    g.append(f'<circle cx="196" cy="28" r="14" fill="none" stroke="#E8705F" stroke-width="7"/>')
    g.append(f'<circle cx="52" cy="42" r="10" fill="none" stroke="#5C97C4" stroke-width="6"/>')
    g.append('</g>'); add("".join(g))
pool_area(596, 548, 0.90)

tree_pine(500, 646, 0.7); tree_round(952, 642, 0.62, C["hillD"])
tent(1524, 606, 0.78)
tree_round(1712, 604, 0.66, C["autumn2"]); tree_pine(1880, 608, 0.6)

# ================================================================= FOREGROUND
add(f'<path d="M 0 700 Q 460 668 940 690 Q 1420 712 1920 680 L 1920 800 L 0 800 Z" fill="url(#fg)"/>')
add(f'<path d="M 0 754 Q 500 730 1020 746 Q 1480 760 1920 736 L 1920 800 L 0 800 Z" fill="{C["path"]}" opacity="0.5"/>')

parasol(630, 742, 1.0, "#E8705F", "#FFFFFF")
parasol(1300, 734, 0.9, "#5C97C4", "#FFFFFF")

for gx in [258, 386, 820, 1160, 1470, 1700]:
    add(f'<path d="M {gx} 726 q 5 -15 10 0 M {gx+11} 726 q 5 -18 10 0 M {gx+22} 726 q 5 -13 10 0" '
        f'stroke="{C["grass2"]}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.65"/>')

S = 1.30          # 人物の基準スケール（身長≈154px）
GY = 772

# ===== 1) 3世代（祖父・祖母・父・子） x≈100-320
person(96,  GY-10, S*0.95, top="#7BAE7F", bot="#53687E", hair_style="gray",  arm="down", skin=SKIN[1])
add(f'<path d="M 132 {GY-14} l 0 -52 q 0 -9 9 -9" stroke="#8A6A52" stroke-width="4" fill="none" stroke-linecap="round"/>')
person(172, GY-6,  S*0.93, top="#C46F9E", bot="#6B5B73", hair_style="gray",  arm="hold", skin=SKIN[0])
person(238, GY,    S*1.04, top="#5C8CB5", bot="#3F5A72", hair_style="short", arm="hold", skin=SKIN[2])
person(298, GY+4,  S*0.74, top="#F2B04C", bot="#46685C", hair_style="short", arm="up", kid=True, skin=SKIN[1])

# ===== 2) 子連れファミリー（ビーチボール） x≈480-700
person(470, GY+2,  S*1.0,  top="#E8705F", bot="#3F5A72", hair_style="long",  arm="hold", skin=SKIN[0])
person(530, GY+6,  S*1.05, top="#4D6B8A", bot="#53687E", hair_style="short", arm="down", hat="#F2B04C", skin=SKIN[3])
person(586, GY+10, S*0.72, top="#6FB6B0", bot="#46685C", hair_style="short", arm="up",  kid=True, skin=SKIN[1])
person(700, GY+8,  S*0.66, top="#EE9C6A", bot="#3F5A72", hair_style="bun",   arm="up",  kid=True, skin=SKIN[0])
add(f'<circle cx="746" cy="{GY-34}" r="19" fill="#FFFFFF"/>')
add(f'<path d="M 727 {GY-34} a 19 19 0 0 1 38 0 Z" fill="#E8705F"/>')
add(f'<path d="M 746 {GY-53} a 19 19 0 0 1 17 27 Z" fill="#5C97C4" opacity="0.92"/>')

# ===== 3) 赤ちゃん連れ（ベビーカー） x≈880
person(876, GY+8, S*1.0, top="#F2B04C", bot="#6B5B73", hair_style="bun", arm="push", skin=SKIN[1])
def stroller(x, gy, s=1.0):
    g = [f'<g transform="translate({x},{gy}) scale({s})">']
    g.append(f'<path d="M -2 -44 L 6 -44 L 62 -44" stroke="#4A5A66" stroke-width="5" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 0 0 L 8 -44 M 56 0 L 62 -44" stroke="#4A5A66" stroke-width="5" fill="none" stroke-linecap="round"/>')
    g.append(f'<path d="M 6 -44 q 3 -36 38 -36 l 16 0 l 0 36 Z" fill="#E8705F"/>')
    g.append(f'<path d="M 62 -44 L 62 -78 q 20 0 26 -10" stroke="#4A5A66" stroke-width="5" fill="none" stroke-linecap="round"/>')
    g.append(f'<circle cx="42" cy="-58" r="9" fill="{SKIN[0]}"/>')
    g.append(f'<path d="M 33 -60 a 9 9 0 0 1 18 0 Z" fill="#54403A"/>')
    g.append(f'<circle cx="0" cy="0" r="13" fill="none" stroke="#3F4E59" stroke-width="5"/>')
    g.append(f'<circle cx="56" cy="0" r="10" fill="none" stroke="#3F4E59" stroke-width="4.5"/>')
    g.append('</g>'); add("".join(g))
stroller(930, GY+8, 1.0)

# ===== 4) カップル（カメラ） x≈1130
person(1116, GY+4, S*1.0,  top="#6FB6B0", bot="#3F5A72", hair_style="short", arm="up",   skin=SKIN[2])
person(1176, GY+8, S*0.97, top="#EE9C6A", bot="#53687E", hair_style="long",  arm="down", skin=SKIN[0])
add(f'<rect x="1132" y="{GY-116}" width="26" height="18" rx="5" fill="#3E4E5A"/>')
add(f'<circle cx="1145" cy="{GY-107}" r="6" fill="{C["train_win"]}"/>')

# ===== 5) ママ友グループ（3人） x≈1370
person(1346, GY,   S*0.99, top="#C46F9E", bot="#6B5B73", hair_style="long", arm="down", skin=SKIN[0])
person(1406, GY+4, S*1.02, top="#5C8CB5", bot="#3F5A72", hair_style="bun",  arm="up",   skin=SKIN[3])
person(1464, GY+8, S*0.97, top="#F2B04C", bot="#46685C", hair_style="long", arm="down", skin=SKIN[1])
add(f'<rect x="1318" y="{GY-58}" width="24" height="29" rx="4" fill="#E8D3B4"/>')
add(f'<path d="M 1323 {GY-58} q 7 -12 14 0" stroke="#C9B79C" stroke-width="3" fill="none"/>')

# ===== 6) ペット連れ x≈1640
person(1628, GY+6, S*1.0, top="#7BAE7F", bot="#53687E", hair_style="short", arm="hold", hat="#E8705F", skin=SKIN[2])
def dog(x, gy, s=1.0):
    g = [f'<g transform="translate({x},{gy}) scale({s})">']
    g.append(f'<rect x="0" y="-24" width="46" height="19" rx="9.5" fill="#C98F5A"/>')
    g.append(f'<rect x="5"  y="-8" width="7" height="9" rx="3.5" fill="#B37F4E"/>')
    g.append(f'<rect x="35" y="-8" width="7" height="9" rx="3.5" fill="#B37F4E"/>')
    g.append(f'<circle cx="52" cy="-33" r="11.5" fill="#C98F5A"/>')
    g.append(f'<path d="M 46 -41 q -6 -11 4 -11 q 7 0 6 11 Z" fill="#A87344"/>')
    g.append(f'<circle cx="59" cy="-32" r="2.4" fill="#3E3229"/>')
    g.append(f'<path d="M 0 -22 q -13 -5 -10 -17" stroke="#C98F5A" stroke-width="6" fill="none" stroke-linecap="round"/>')
    g.append('</g>'); add("".join(g))
dog(1678, GY+12, 1.05)
add(f'<path d="M 1662 {GY-56} q 34 12 44 34" stroke="#7A8A96" stroke-width="2.8" fill="none"/>')

# ===== 7) ひとり旅（バックパック） x≈1820
person(1798, GY+2, S*1.0, top="#4D6B8A", bot="#6B5B73", hair_style="short", arm="down", skin=SKIN[1])
add(f'<rect x="1814" y="{GY-116}" width="25" height="37" rx="7" fill="#E8845C"/>')
add(f'<rect x="1818" y="{GY-106}" width="17" height="11" rx="4" fill="#C9664A"/>')

add(f'<path d="M 0 800 L 0 782 Q 220 766 440 784 Q 720 806 990 788 Q 1300 766 1600 788 Q 1790 800 1920 782 L 1920 800 Z" fill="{C["grass3"]}" opacity="0.4"/>')

BODY = "\n".join(out)


def svg(viewbox):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" '
            f'width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" '
            f'aria-label="家族・3世代・カップル・ママ友・ペット連れ・ひとり旅など、いろいろな人が旅を楽しんでいる風景のイラスト">\n'
            f'{BODY}\n</svg>\n')

open("hero-1920x800.svg", "w", encoding="utf-8").write(svg(f"0 0 {W} {H}"))
open("ogp-1200x630.svg", "w", encoding="utf-8").write(svg("198 0 1524 800"))
open("square-1080.svg", "w", encoding="utf-8").write(svg("470 0 800 800"))
print("ok")
