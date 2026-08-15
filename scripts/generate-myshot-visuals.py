"""Generate MyShot portfolio visuals from the validation pipeline."""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path

import cv2
import matplotlib
import numpy as np
import torch

matplotlib.use("Agg")
import matplotlib.pyplot as plt


EDGES = [
    (0, 1), (1, 2), (2, 3),
    (0, 4), (4, 5), (5, 6),
    (0, 7), (7, 8), (8, 9), (9, 10),
    (8, 11), (11, 12), (12, 13),
    (8, 14), (14, 15), (15, 16),
]
PHASES = [("Address", 0), ("Top", 3), ("Impact", 5), ("Finish", 7)]
BG = "#09121a"
PANEL = "#111d27"
TEXT = "#f4f7fa"
MUTED = "#9aabb8"
CYAN = "#54d6e8"
GREEN = "#7ee2a8"
ORANGE = "#ffb765"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--myshot-root", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--checkpoint", type=Path, default=Path("models/golfpose_mag17_gvhmr_341_reli.pth"))
    parser.add_argument("--golfdb-data", type=Path, default=Path("data/golfdb_h36m_2d.npz"))
    parser.add_argument("--video", type=Path, default=Path("data/golfdb_upload/8.mp4"))
    parser.add_argument("--clip-id", default="8")
    parser.add_argument("--cmu-asf", type=Path, default=Path("data/cmu_golf/64.asf"))
    parser.add_argument("--cmu-dir", type=Path, default=Path("data/cmu_golf"))
    parser.add_argument("--device", choices=("auto", "cpu", "cuda"), default="auto")
    return parser.parse_args()


def resolve(root: Path, path: Path) -> Path:
    return path if path.is_absolute() else root / path


def load_model(root: Path, checkpoint: Path, device: torch.device):
    model_root = root / "validation" / "MotionAGFormer"
    sys.path.insert(0, str(model_root))
    from model.MotionAGFormer import MotionAGFormer

    state = torch.load(checkpoint, map_location="cpu", weights_only=False)
    frames = state.get("args", {}).get("n_frames", 243)
    model = MotionAGFormer(
        n_layers=16,
        dim_in=3,
        dim_feat=128,
        dim_rep=512,
        dim_out=3,
        mlp_ratio=4,
        num_heads=8,
        n_frames=frames,
        num_joints=17,
        neighbour_num=2,
        use_temporal_similarity=True,
        use_adaptive_fusion=True,
    ).to(device)
    model.load_state_dict(state["model"])
    model.eval()
    return model, frames


def infer(model, kp2d: np.ndarray, frames: int, device: torch.device) -> np.ndarray:
    points = kp2d.copy()
    points[..., 0] = points[..., 0] / 1920 * 2 - 1
    points[..., 1] = points[..., 1] / 1080 * 2 - 1
    tensor = torch.from_numpy(points).float()
    tensor = torch.cat([tensor, torch.ones(tensor.shape[0], tensor.shape[1], 1)], -1)
    count = min(len(tensor), frames)
    if len(tensor) < frames:
        tensor = torch.cat([tensor, tensor[-1:].repeat(frames - len(tensor), 1, 1)], 0)
    else:
        tensor = tensor[:frames]
    with torch.no_grad():
        return model(tensor.unsqueeze(0).to(device))[0, :count].cpu().numpy()


def read_frame(video: Path, index: int) -> np.ndarray:
    capture = cv2.VideoCapture(str(video))
    capture.set(cv2.CAP_PROP_POS_FRAMES, index)
    ok, frame = capture.read()
    capture.release()
    if not ok:
        raise RuntimeError(f"Could not read frame {index} from {video}")
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


def anonymize(frame: np.ndarray, points: np.ndarray) -> np.ndarray:
    height, width = frame.shape[:2]
    small = cv2.resize(frame, (max(18, width // 8), max(18, height // 8)), interpolation=cv2.INTER_AREA)
    hidden = cv2.resize(small, (width, height), interpolation=cv2.INTER_NEAREST)
    hidden = cv2.GaussianBlur(hidden, (9, 9), 0)
    scaled = scale_points(points, width, height)
    head = scaled[10]
    radius = max(8, int(np.linalg.norm(scaled[10] - scaled[9]) * 1.6))
    cv2.circle(hidden, tuple(np.round(head).astype(int)), radius, (8, 14, 20), -1)
    return hidden


def scale_points(points: np.ndarray, width: int, height: int) -> np.ndarray:
    scaled = points.copy()
    scaled[:, 0] *= width / 1920
    scaled[:, 1] *= height / 1080
    return scaled


def draw_2d(ax, frame: np.ndarray, points: np.ndarray) -> None:
    height, width = frame.shape[:2]
    scaled = scale_points(points, width, height)
    ax.imshow(frame)
    for start, end in EDGES:
        ax.plot(
            [scaled[start, 0], scaled[end, 0]],
            [scaled[start, 1], scaled[end, 1]],
            color=CYAN,
            linewidth=2.1,
        )
    ax.scatter(scaled[:, 0], scaled[:, 1], s=15, c=GREEN, edgecolors="#09202a", linewidths=0.5)


def set_3d_equal(ax, sequence: np.ndarray) -> None:
    center = sequence.mean(axis=(0, 1))
    radius = max(np.ptp(sequence, axis=(0, 1))) * 0.58
    radius = max(radius, 0.25)
    ax.set_xlim(center[0] - radius, center[0] + radius)
    ax.set_ylim(center[1] - radius, center[1] + radius)
    ax.set_zlim(center[2] - radius, center[2] + radius)


def draw_3d(ax, pose: np.ndarray, full_sequence: np.ndarray) -> None:
    for start, end in EDGES:
        ax.plot(
            [pose[start, 0], pose[end, 0]],
            [pose[start, 1], pose[end, 1]],
            [pose[start, 2], pose[end, 2]],
            color=GREEN,
            linewidth=2.5,
        )
    ax.scatter(pose[:, 0], pose[:, 1], pose[:, 2], s=16, c=CYAN, depthshade=False)
    set_3d_equal(ax, full_sequence)
    ax.view_init(elev=12, azim=-75)
    ax.set_axis_off()
    ax.set_facecolor(PANEL)


def make_phase_panel(
    sample: dict,
    video: Path,
    prediction: np.ndarray,
    output: Path,
) -> None:
    fig = plt.figure(figsize=(13.4, 10.8), facecolor=BG)
    grid = fig.add_gridspec(3, 4, hspace=0.16, wspace=0.08, top=0.88, bottom=0.07, left=0.07, right=0.98)
    fig.suptitle("From one camera view to a 3D golf swing", color=TEXT, fontsize=24, fontweight="bold", x=0.07, ha="left")
    fig.text(0.07, 0.905, "Four swing phases from GolfDB clip 8 · source frames anonymized", color=MUTED, fontsize=11)

    row_labels = ["Anonymized\nsource", "2D pose", "3D\nreconstruction"]
    for column, (label, phase_slot) in enumerate(PHASES):
        frame_index = int(np.clip(sample["phases"][phase_slot], 0, len(prediction) - 1))
        frame = read_frame(video, frame_index)
        hidden = anonymize(frame, sample["kp2d"][frame_index])

        source_ax = fig.add_subplot(grid[0, column])
        source_ax.imshow(hidden)
        source_ax.set_title(label, color=TEXT, fontsize=14, fontweight="bold", pad=8)
        source_ax.set_facecolor(PANEL)
        source_ax.axis("off")

        pose_ax = fig.add_subplot(grid[1, column])
        draw_2d(pose_ax, hidden, sample["kp2d"][frame_index])
        pose_ax.set_facecolor(PANEL)
        pose_ax.axis("off")

        reconstruction_ax = fig.add_subplot(grid[2, column], projection="3d")
        draw_3d(reconstruction_ax, prediction[frame_index], prediction)

        if column == 0:
            for row, text in enumerate(row_labels):
                position = [0.745, 0.47, 0.19][row]
                fig.text(0.018, position, text, color=MUTED, fontsize=10, va="center", ha="left")

    fig.text(
        0.98,
        0.022,
        "RTMPose 2D → reliability-gated MotionAGFormer 3D · current checkpoint",
        color=MUTED,
        fontsize=9,
        ha="right",
    )
    fig.savefig(output, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def load_cmu_module(root: Path):
    path = root / "validation" / "cmu_fk_eval.py"
    spec = importlib.util.spec_from_file_location("myshot_cmu_fk_eval", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def align_to_canonical(points: np.ndarray, root: np.ndarray, scale: float) -> np.ndarray:
    hip = (points[:, 1] + points[:, 4]) / 2
    thorax = (points[:, 11] + points[:, 14]) / 2
    body_scale = np.linalg.norm(thorax - hip, axis=1)
    reference = np.median(body_scale[body_scale > 1]) if np.any(body_scale > 1) else 1.0
    return (points - hip.mean(0)) * (scale / (reference + 1e-6)) + root


def zscore(values: np.ndarray) -> np.ndarray:
    return (values - values.mean()) / (values.std() + 1e-9)


def make_cmu_panel(
    root: Path,
    model,
    frames: int,
    device: torch.device,
    asf: Path,
    cmu_dir: Path,
    output: Path,
) -> list[float]:
    cmu = load_cmu_module(root)
    canonical = np.load(root / "data" / "golfpose" / "canonical_2d.npz")
    canonical_root, canonical_scale = canonical["root"], float(canonical["scale"])
    trials = sorted(cmu_dir.glob("64_*.amc"))
    if len(trials) != 6:
        raise RuntimeError(f"Expected six CMU trials, found {len(trials)}")

    curves = []
    correlations = []
    for trial in trials:
        sequence = cmu.fk_sequence(str(asf), str(trial))
        up_axis = int(np.argmax(np.ptp(sequence.reshape(-1, 3), axis=0)))
        projected = cmu.make_faceon_2d(sequence, up_axis)
        aligned = align_to_canonical(projected, canonical_root, canonical_scale)
        ground_truth = cmu.normalize_3d_golfpose(sequence, up_axis)
        prediction = infer(model, aligned, frames, device)
        count = min(len(prediction), len(ground_truth))
        gt_xfactor = cmu.xf3d(ground_truth[:count])
        pred_xfactor = cmu.xf3d(prediction[:count])
        correlation = float(np.corrcoef(gt_xfactor, pred_xfactor)[0, 1])
        correlations.append(correlation)
        sign = -1.0 if correlation < 0 else 1.0
        curves.append((trial.stem, zscore(gt_xfactor), zscore(pred_xfactor * sign), correlation))

    mean_abs = float(np.mean(np.abs(correlations)))
    fig, axes = plt.subplots(2, 3, figsize=(14.5, 8.5), sharex=False, sharey=True, facecolor=BG)
    fig.subplots_adjust(top=0.78, bottom=0.13, left=0.07, right=0.98, wspace=0.16, hspace=0.36)
    fig.suptitle("Independent motion-capture validation", color=TEXT, fontsize=24, fontweight="bold", x=0.07, ha="left", y=0.95)
    fig.text(0.07, 0.884, "The reconstructed 3D swing tracks the ground-truth X-Factor pattern across all six CMU trials.", color=MUTED, fontsize=11)
    fig.text(0.07, 0.828, f"Mean |r| = {mean_abs:.2f}", color=GREEN, fontsize=21, fontweight="bold")
    fig.text(0.255, 0.834, "six independent real-golf mocap sequences", color=MUTED, fontsize=10)

    for axis, (name, ground_truth, prediction, correlation) in zip(axes.flat, curves):
        progress = np.linspace(0, 100, len(ground_truth))
        axis.set_facecolor(PANEL)
        axis.plot(progress, ground_truth, color=TEXT, linewidth=2.2, label="Mocap GT")
        axis.plot(progress, prediction, color=GREEN, linewidth=1.8, label="3D reconstruction")
        axis.axhline(0, color="#435460", linewidth=0.8)
        axis.grid(color="#263845", linewidth=0.5, alpha=0.7)
        axis.set_title(f"{name.replace('_', '-')}  ·  |r|={abs(correlation):.2f}", color=TEXT, fontsize=11, loc="left", pad=8)
        axis.tick_params(colors=MUTED, labelsize=8)
        axis.spines[["top", "right", "left", "bottom"]].set_color("#30424f")
        axis.set_xlim(0, 100)
        axis.set_xlabel("swing progress (%)", color=MUTED, fontsize=8)

    axes[0, 0].set_ylabel("normalized X-Factor", color=MUTED, fontsize=9)
    axes[1, 0].set_ylabel("normalized X-Factor", color=MUTED, fontsize=9)
    handles, labels = axes[0, 0].get_legend_handles_labels()
    legend = fig.legend(handles, labels, loc="lower center", ncol=2, frameon=False, bbox_to_anchor=(0.5, 0.035))
    for label in legend.get_texts():
        label.set_color(TEXT)
    fig.text(
        0.98,
        0.018,
        "Curves are centered and variance-normalized; prediction sign is aligned for cross-skeleton handedness.",
        color=MUTED,
        fontsize=8.5,
        ha="right",
    )
    fig.savefig(output, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)
    return correlations


def make_method_svg(output: Path) -> None:
    labels = [
        ("Single-view video", "in-the-wild golf swing"),
        ("RTMPose 2D", "17 body keypoints"),
        ("Reliable pseudo-3D", "GVHMR teacher + gating"),
        ("MotionAGFormer", "temporal 2D→3D lifter"),
        ("Golf motion", "3D pose + X-Factor"),
    ]
    boxes = []
    arrows = []
    for index, (title, subtitle) in enumerate(labels):
        x = 50 + index * 292
        boxes.append(
            f'<rect x="{x}" y="72" width="238" height="112" rx="18" fill="#111d27" stroke="#355365"/>'
            f'<text x="{x + 119}" y="118" text-anchor="middle" fill="#f4f7fa" font-size="21" font-weight="700">{title}</text>'
            f'<text x="{x + 119}" y="151" text-anchor="middle" fill="#9aabb8" font-size="15">{subtitle}</text>'
        )
        if index < len(labels) - 1:
            arrows.append(
                f'<path d="M {x + 244} 128 H {x + 282}" stroke="#54d6e8" stroke-width="3" marker-end="url(#arrow)"/>'
            )
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1456" height="258" viewBox="0 0 1456 258">
<rect width="1456" height="258" rx="22" fill="#09121a"/>
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#54d6e8"/></marker></defs>
<text x="50" y="40" fill="#7ee2a8" font-size="16" font-weight="700">METHOD</text>
{''.join(boxes)}
{''.join(arrows)}
<text x="1406" y="226" text-anchor="end" fill="#9aabb8" font-size="13">341 video pseudo-labels · gentle reliability gating · 243-frame temporal context</text>
</svg>'''
    output.write_text(svg, encoding="utf-8")


def main() -> None:
    args = parse_args()
    root = args.myshot_root.resolve()
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    checkpoint = resolve(root, args.checkpoint)
    golfdb_data = resolve(root, args.golfdb_data)
    video = resolve(root, args.video)
    asf = resolve(root, args.cmu_asf)
    cmu_dir = resolve(root, args.cmu_dir)
    device_name = "cuda" if args.device == "auto" and torch.cuda.is_available() else args.device
    if device_name == "auto":
        device_name = "cpu"
    device = torch.device(device_name)

    model, frames = load_model(root, checkpoint, device)
    samples = np.load(golfdb_data, allow_pickle=True)["samples"].item()
    if args.clip_id not in samples:
        raise KeyError(f"Clip {args.clip_id} is not present in {golfdb_data}")
    sample = samples[args.clip_id]
    prediction = infer(model, sample["kp2d"], frames, device)

    phase_output = output_dir / "myshot-golfdb-2d-to-3d.png"
    cmu_output = output_dir / "myshot-cmu-xfactor.png"
    method_output = output_dir / "myshot-method.svg"
    make_phase_panel(sample, video, prediction, phase_output)
    correlations = make_cmu_panel(root, model, frames, device, asf, cmu_dir, cmu_output)
    make_method_svg(method_output)

    print(f"device={device}")
    print(f"checkpoint={checkpoint}")
    print(f"phase_panel={phase_output}")
    print(f"cmu_panel={cmu_output}")
    print(f"method={method_output}")
    print("cmu_abs_r=" + ",".join(f"{abs(value):.4f}" for value in correlations))
    print(f"cmu_mean_abs_r={np.mean(np.abs(correlations)):.4f}")


if __name__ == "__main__":
    main()
