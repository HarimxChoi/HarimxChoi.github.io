from __future__ import annotations

import argparse
import io
import json
import math
import subprocess
import zipfile
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


SOURCE_ZIP = Path(
    r"F:\aihub-golf\스포츠 사람 동작 영상(골프)\Training\Amateur\female\[원천]swing_02.zip"
)
LABEL_ZIP = Path(
    r"F:\aihub-golf\스포츠 사람 동작 영상(골프)\Training\Amateur\female\[라벨]swing_02.zip"
)
LABEL_PREFIX = (
    "20201128_General_025_DIS_S_F20_MT/"
    "20201128_General_025_DIS_S_F20_MT_001_"
)
FRAME_IDS = [5, 20, 35, 45, 60, 75, 85, 88, 89, 91, 92, 93, 100, 110]
HERO_FRAME = 91
CANVAS = (1600, 1000)
CROP = (330, 0, 1300, 1030)

COLORS = {
    "bg": "#F7F6F2",
    "surface": "#FFFFFF",
    "ink": "#202827",
    "muted": "#566361",
    "accent": "#587776",
    "soft": "#DFE9E6",
    "person": "#5BD3B7",
    "club": "#6EA8FF",
    "ball": "#F4C95D",
    "skeleton": "#EAF8F4",
}

POINT_NAMES = [
    "head",
    "neck",
    "chest",
    "right_shoulder",
    "left_shoulder",
    "right_elbow",
    "left_elbow",
    "right_wrist",
    "left_wrist",
    "hip",
    "right_hip",
    "left_hip",
    "right_knee",
    "left_knee",
    "right_ankle",
    "left_ankle",
]
POINT_INDEX = {name: index for index, name in enumerate(POINT_NAMES)}
SKELETON = [
    ("head", "neck"),
    ("neck", "chest"),
    ("chest", "right_shoulder"),
    ("chest", "left_shoulder"),
    ("right_shoulder", "right_elbow"),
    ("right_elbow", "right_wrist"),
    ("left_shoulder", "left_elbow"),
    ("left_elbow", "left_wrist"),
    ("chest", "hip"),
    ("hip", "right_hip"),
    ("hip", "left_hip"),
    ("right_hip", "right_knee"),
    ("right_knee", "right_ankle"),
    ("left_hip", "left_knee"),
    ("left_knee", "left_ankle"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path(r"C:\Windows\Fonts") / name), size)


def load_labels() -> dict[int, dict]:
    result: dict[int, dict] = {}
    with zipfile.ZipFile(LABEL_ZIP) as archive:
        for frame_id in FRAME_IDS:
            member = f"{LABEL_PREFIX}{frame_id:04d}.json"
            result[frame_id] = json.loads(archive.read(member))
    return result


def load_frames() -> dict[int, Image.Image]:
    result: dict[int, Image.Image] = {}
    with zipfile.ZipFile(SOURCE_ZIP) as archive:
        for frame_id in FRAME_IDS:
            member = f"{LABEL_PREFIX}{frame_id:04d}.jpg"
            result[frame_id] = Image.open(io.BytesIO(archive.read(member))).convert("RGB")
    return result


def annotations(label: dict) -> tuple[dict[str, tuple[int, int, int, int]], np.ndarray]:
    boxes: dict[str, tuple[int, int, int, int]] = {}
    points = None
    for item in label["annotations"]:
        if "box" in item:
            boxes[item["class"]] = tuple(item["box"])
        elif item.get("class") == "person" and "points" in item:
            points = np.asarray(item["points"], dtype=float).reshape(-1, 3)
    if points is None:
        raise RuntimeError("Missing pose points")
    return boxes, points


def angle(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
    ba = a - b
    bc = c - b
    denom = float(np.linalg.norm(ba) * np.linalg.norm(bc))
    if denom == 0:
        return 0.0
    cosine = float(np.clip(np.dot(ba, bc) / denom, -1.0, 1.0))
    return math.degrees(math.acos(cosine))


def line_angle(a: np.ndarray, b: np.ndarray) -> float:
    delta = b - a
    return math.degrees(math.atan2(float(delta[1]), float(delta[0])))


def metrics(points: np.ndarray) -> dict[str, float]:
    xy = points[:, :2]
    shoulder = abs(((line_angle(xy[POINT_INDEX["right_shoulder"]], xy[POINT_INDEX["left_shoulder"]]) + 90.0) % 180.0) - 90.0)
    torso = abs(((line_angle(xy[POINT_INDEX["hip"]], xy[POINT_INDEX["neck"]]) + 180.0) % 180.0) - 90.0)
    knee = angle(
        xy[POINT_INDEX["left_hip"]],
        xy[POINT_INDEX["left_knee"]],
        xy[POINT_INDEX["left_ankle"]],
    )
    return {"shoulder": shoulder, "torso": torso, "knee": knee}


def transform_point(x: float, y: float, target: tuple[int, int, int, int]) -> tuple[float, float]:
    x0, y0, x1, y1 = CROP
    tx0, ty0, tx1, ty1 = target
    return (
        tx0 + (x - x0) / (x1 - x0) * (tx1 - tx0),
        ty0 + (y - y0) / (y1 - y0) * (ty1 - ty0),
    )


def draw_box(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    label: str,
    color: str,
    target: tuple[int, int, int, int],
) -> None:
    x, y, width, height = box
    p0 = transform_point(x, y, target)
    p1 = transform_point(x + width, y + height, target)
    p0 = (max(target[0], p0[0]), max(target[1], p0[1]))
    p1 = (min(target[2], p1[0]), min(target[3], p1[1]))
    draw.rounded_rectangle([p0, p1], radius=10, outline=color, width=5)
    text_box = draw.textbbox((0, 0), label, font=font(24, True))
    text_width = text_box[2] - text_box[0]
    label_x = min(max(target[0], p0[0]), target[2] - text_width - 20)
    label_top = max(target[1], p0[1] - 34)
    draw.rounded_rectangle(
        [label_x, label_top, label_x + text_width + 20, label_top + 32],
        radius=8,
        fill=color,
    )
    draw.text((label_x + 10, label_top + 1), label, font=font(24, True), fill=COLORS["ink"])


def anonymize_face(image: Image.Image, points: np.ndarray) -> None:
    head = points[POINT_INDEX["head"], :2]
    neck = points[POINT_INDEX["neck"], :2]
    radius = max(36, int(np.linalg.norm(head - neck) * 0.9))
    left = max(0, int(head[0] - radius))
    top = max(0, int(head[1] - radius))
    right = min(image.width, int(head[0] + radius))
    bottom = min(image.height, int(head[1] + radius))
    patch = image.crop((left, top, right, bottom)).filter(ImageFilter.GaussianBlur(radius=18))
    image.paste(patch, (left, top))


def prepare_video_panel(
    image: Image.Image,
    points: np.ndarray,
    boxes: dict[str, tuple[int, int, int, int]],
    target: tuple[int, int, int, int],
) -> Image.Image:
    anonymize_face(image, points)
    focused = image.filter(ImageFilter.GaussianBlur(radius=8))
    for box in boxes.values():
        x, y, width, height = box
        margin = 18
        region = (
            max(0, x - margin),
            max(0, y - margin),
            min(image.width, x + width + margin),
            min(image.height, y + height + margin),
        )
        focused.paste(image.crop(region), region[:2])
    crop = focused.crop(CROP)
    tw, th = target[2] - target[0], target[3] - target[1]
    return crop.resize((tw, th), Image.Resampling.LANCZOS)


def draw_skeleton(draw: ImageDraw.ImageDraw, points: np.ndarray, target: tuple[int, int, int, int]) -> None:
    for start, end in SKELETON:
        i = POINT_INDEX[start]
        j = POINT_INDEX[end]
        if points[i, 2] <= 0 or points[j, 2] <= 0:
            continue
        p0 = transform_point(points[i, 0], points[i, 1], target)
        p1 = transform_point(points[j, 0], points[j, 1], target)
        draw.line([p0, p1], fill=COLORS["skeleton"], width=7)
    for x, y, visible in points:
        if visible <= 0:
            continue
        px, py = transform_point(x, y, target)
        draw.ellipse([px - 7, py - 7, px + 7, py + 7], fill=COLORS["person"], outline=COLORS["ink"], width=2)


def draw_angle_overlay(draw: ImageDraw.ImageDraw, points: np.ndarray, target: tuple[int, int, int, int]) -> None:
    pairs = [
        ("right_shoulder", "left_shoulder", COLORS["person"]),
        ("right_hip", "left_hip", COLORS["ball"]),
    ]
    for first, second, color in pairs:
        p0 = transform_point(*points[POINT_INDEX[first], :2], target)
        p1 = transform_point(*points[POINT_INDEX[second], :2], target)
        draw.line([p0, p1], fill=color, width=6)

    knee = transform_point(*points[POINT_INDEX["left_knee"], :2], target)
    hip = transform_point(*points[POINT_INDEX["left_hip"], :2], target)
    ankle = transform_point(*points[POINT_INDEX["left_ankle"], :2], target)
    draw.line([hip, knee, ankle], fill=COLORS["ball"], width=6)


def draw_panel(
    canvas: Image.Image,
    frame_id: int,
    action: str,
    values: dict[str, float],
    boxes: dict[str, tuple[int, int, int, int]],
) -> None:
    draw = ImageDraw.Draw(canvas)
    left = 1050
    draw.rounded_rectangle([1010, 54, 1550, 946], radius=30, fill=COLORS["surface"])
    draw.text((left, 92), "MYSHOT VISION", font=font(34, True), fill=COLORS["accent"])
    draw.text((left, 146), "LIVE SWING ANALYSIS", font=font(42, True), fill=COLORS["ink"])
    draw.text((left, 204), f"PHASE  {action.upper()}", font=font(24, True), fill=COLORS["muted"])
    draw.line([(left, 248), (1508, 248)], fill="#CFD7D3", width=3)

    cards = [
        ("SHOULDER LINE", f"{values['shoulder']:.1f}°"),
        ("KNEE ANGLE", f"{values['knee']:.1f}°"),
        ("TORSO LEAN", f"{values['torso']:.1f}°"),
        ("TRACKED TARGETS", f"{len(boxes)} / 3"),
    ]
    for index, (label, value) in enumerate(cards):
        y = 292 + index * 102
        draw.rounded_rectangle([left, y, 1508, y + 82], radius=18, fill=COLORS["soft"])
        draw.text((left + 22, y + 17), label, font=font(20, True), fill=COLORS["muted"])
        draw.text((1484, y + 11), value, font=font(34, True), fill=COLORS["ink"], anchor="ra")

    draw.text((left, 720), "DETECT  →  TRACK  →  RECONSTRUCT", font=font(21, True), fill=COLORS["accent"])
    draw.text((left, 760), "Golfer · Club · Ball", font=font(25), fill=COLORS["ink"])
    draw.text((left, 804), "2D Pose → 3D Motion", font=font(25), fill=COLORS["ink"])
    draw.text((left, 848), "Ball speed · Direction · Carry", font=font(25), fill=COLORS["ink"])
    draw.text((left, 907), f"FRAME {frame_id:03d} · annotated research-data demo", font=font(18), fill=COLORS["muted"])


def render_frame(
    frame_id: int,
    image: Image.Image,
    label: dict,
    ball_trail: list[tuple[float, float]],
) -> Image.Image:
    boxes, points = annotations(label)
    target = (54, 54, 970, 946)
    canvas = Image.new("RGB", CANVAS, COLORS["bg"])
    panel = prepare_video_panel(image.copy(), points, boxes, target)
    canvas.paste(panel, (target[0], target[1]))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle(target, radius=28, outline=COLORS["surface"], width=8)

    draw_skeleton(draw, points, target)
    draw_angle_overlay(draw, points, target)
    for label_name in ("person", "club", "ball"):
        if label_name in boxes:
            draw_box(draw, boxes[label_name], label_name.upper(), COLORS[label_name], target)

    if "ball" in boxes:
        x, y, width, height = boxes["ball"]
        ball_trail.append(transform_point(x + width / 2, y + height / 2, target))
    if len(ball_trail) > 1:
        draw.line(ball_trail[-8:], fill=COLORS["ball"], width=6)
        for px, py in ball_trail[-8:]:
            draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=COLORS["ball"])

    draw_panel(canvas, frame_id, label["image"]["action"], metrics(points), boxes)
    return canvas


def save_outputs(output_dir: Path) -> None:
    labels = load_labels()
    frames = load_frames()
    output_dir.mkdir(parents=True, exist_ok=True)

    rendered: list[Image.Image] = []
    trail: list[tuple[float, float]] = []
    hero = None
    for frame_id in FRAME_IDS:
        image = render_frame(frame_id, frames[frame_id], labels[frame_id], trail)
        rendered.append(image)
        if frame_id == HERO_FRAME:
            hero = image.copy()

    if hero is None:
        raise RuntimeError("Hero frame was not rendered")

    hero_path = output_dir / "myshot-vision-tracking.png"
    gif_path = output_dir / "myshot-vision-tracking.gif"
    mp4_path = output_dir / "myshot-vision-tracking.mp4"
    hero.save(hero_path, optimize=True)

    gif_frames = [frame.resize((1280, 800), Image.Resampling.LANCZOS) for frame in rendered]
    gif_frames[0].save(
        gif_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=[260, 220, 220, 240, 220, 180, 160, 150, 120, 120, 120, 150, 220, 420],
        loop=0,
        optimize=True,
    )

    fps = 8
    frame_sequence = []
    repeats = [2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 4]
    for frame, repeat in zip(gif_frames, repeats, strict=True):
        frame_sequence.extend([frame] * repeat)
    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        "1280x800",
        "-r",
        str(fps),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(mp4_path),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    for frame in frame_sequence:
        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
    process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError("ffmpeg failed")

    print(f"hero={hero_path} {hero.size}")
    print(f"gif={gif_path} frames={len(gif_frames)} size={gif_frames[0].size}")
    print(f"mp4={mp4_path} frames={len(frame_sequence)} fps={fps}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    save_outputs(args.output_dir)


if __name__ == "__main__":
    main()
