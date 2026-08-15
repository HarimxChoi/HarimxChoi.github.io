import argparse
import csv
import html
import re
from pathlib import Path

import numpy as np


COLORS = {
    "ce": "#547a95",
    "focal_rdrop": "#c25a35",
    "adaptive": "#7867a4",
}


def read_metrics(path: Path) -> list[dict[str, float]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        rows = []
        for raw in csv.DictReader(handle):
            rows.append({key: float(value) for key, value in raw.items()})
    if not rows:
        raise ValueError(f"No metric rows found in {path}")
    return rows


def epoch_from_probability_path(path: Path) -> int:
    match = re.search(r"ep(\d+)", path.stem)
    if not match:
        raise ValueError(f"Could not infer epoch from {path.name}")
    return int(match.group(1))


def metric_row(rows: list[dict[str, float]], epoch: int) -> dict[str, float]:
    for row in rows:
        if int(row["epoch"]) == epoch:
            return row
    raise ValueError(f"Epoch {epoch} not present in metrics")


def macro_f1(labels: np.ndarray, predictions: np.ndarray) -> float:
    scores = []
    for label in np.unique(labels):
        true_positive = np.sum((predictions == label) & (labels == label))
        false_positive = np.sum((predictions == label) & (labels != label))
        false_negative = np.sum((predictions != label) & (labels == label))
        denominator = 2 * true_positive + false_positive + false_negative
        scores.append(2 * true_positive / denominator if denominator else 0.0)
    return float(np.mean(scores))


def load_probability_stats(path: Path, bins: int = 15) -> dict:
    with np.load(path) as archive:
        probabilities = archive["y_prob"]
        labels = archive["y_true"]
    predictions = probabilities.argmax(axis=1)
    confidence = probabilities.max(axis=1)
    correct = predictions == labels
    boundaries = np.linspace(0.0, 1.0, bins + 1)
    reliability = []
    ece = 0.0
    for index in range(bins):
        mask = (confidence > boundaries[index]) & (confidence <= boundaries[index + 1])
        count = int(mask.sum())
        if count:
            mean_confidence = float(confidence[mask].mean())
            accuracy = float(correct[mask].mean())
            fraction = count / len(labels)
            ece += fraction * abs(accuracy - mean_confidence)
        else:
            mean_confidence = (boundaries[index] + boundaries[index + 1]) / 2
            accuracy = None
            fraction = 0.0
        reliability.append(
            {
                "center": (boundaries[index] + boundaries[index + 1]) / 2,
                "confidence": mean_confidence,
                "accuracy": accuracy,
                "fraction": fraction,
                "count": count,
            }
        )
    return {
        "labels": labels,
        "ece": float(ece),
        "f1": macro_f1(labels, predictions),
        "accuracy": float(correct.mean()),
        "reliability": reliability,
        "n": len(labels),
    }


def svg_style() -> str:
    return """<style>
      .bg{fill:#f7f5ef}.panel{fill:#efede7}.ink{fill:#272b31}.muted{fill:#6d7480}.grid{stroke:#d8d4ca}.axis{stroke:#9e9a91}.ideal{stroke:#8d8f94;stroke-dasharray:8 7}.ce-stroke{stroke:#547a95}.ce-fill{fill:#547a95}.robust-stroke{stroke:#c25a35}.robust-fill{fill:#c25a35}.adaptive-stroke{stroke:#7867a4}.adaptive-fill{fill:#7867a4}.title{font:600 34px ui-sans-serif,system-ui,sans-serif}.subtitle{font:19px ui-sans-serif,system-ui,sans-serif}.heading{font:600 25px ui-sans-serif,system-ui,sans-serif}.label{font:20px ui-sans-serif,system-ui,sans-serif}.small{font:17px ui-sans-serif,system-ui,sans-serif}.metric{font:600 20px ui-monospace,SFMono-Regular,monospace}.note{font:16px ui-sans-serif,system-ui,sans-serif}
      @media(prefers-color-scheme:dark){.bg{fill:#1d1f21}.panel{fill:#26282b}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.grid{stroke:#3b3d40}.axis{stroke:#6c6e72}.ideal{stroke:#9da0a5}.ce-stroke{stroke:#79a5c1}.ce-fill{fill:#79a5c1}.robust-stroke{stroke:#e07a56}.robust-fill{fill:#e07a56}.adaptive-stroke{stroke:#a99add}.adaptive-fill{fill:#a99add}}
    </style>"""


def pct(value: float, digits: int = 2) -> str:
    return f"{value * 100:.{digits}f}%"


def write_svg(path: Path, parts: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(parts) + "\n", encoding="utf-8")


def reliability_svg(
    output: Path,
    ce: dict,
    focal_rdrop: dict,
    ce_epoch: int,
    focal_rdrop_epoch: int,
    estimated_flops: float,
) -> None:
    width, height = 1500, 900
    plot_top, plot_bottom = 242, 742
    plot_height = plot_bottom - plot_top
    rel_left, rel_right = 100, 800
    hist_left, hist_right = 910, 1420

    def rel_x(value: float) -> float:
        return rel_left + value * (rel_right - rel_left)

    def rel_y(value: float) -> float:
        return plot_bottom - value * plot_height

    max_fraction = max(
        point["fraction"] for stats in (ce, focal_rdrop) for point in stats["reliability"]
    )
    hist_max = float(np.ceil(max_fraction * 10) / 10)

    def hist_x(value: float) -> float:
        return hist_left + value * (hist_right - hist_left)

    def hist_y(value: float) -> float:
        return plot_bottom - value / hist_max * plot_height

    description = (
        f"At the same estimated compute budget, cross entropy at epoch {ce_epoch} has ECE "
        f"{pct(ce['ece'])} and macro F1 {pct(ce['f1'])}; Focal plus R-Drop at epoch "
        f"{focal_rdrop_epoch} has ECE {pct(focal_rdrop['ece'])} and macro F1 {pct(focal_rdrop['f1'])}."
    )
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">ISIC reliability at an equal compute budget</title>',
        f'<desc id="desc">{html.escape(description)}</desc>',
        svg_style(),
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        '<text class="title ink" x="80" y="58">Reliability at the same compute budget</text>',
        f'<text class="subtitle muted" x="80" y="88">ConvNeXt V2-Tiny · ISIC fold 3 · n={ce["n"]:,} · seed 42 · 15 equal-width bins</text>',
        '<rect class="panel" x="80" y="112" width="410" height="84" rx="12"/>',
        '<circle class="ce-fill" cx="108" cy="141" r="7"/>',
        f'<text class="label ink" x="128" y="148">CE · epoch {ce_epoch}</text>',
        f'<text class="metric ink" x="108" y="180">ECE {pct(ce["ece"])} · macro-F1 {pct(ce["f1"])}</text>',
        '<rect class="panel" x="508" y="112" width="450" height="84" rx="12"/>',
        '<circle class="robust-fill" cx="536" cy="141" r="7"/>',
        f'<text class="label ink" x="556" y="148">Focal + R-Drop · epoch {focal_rdrop_epoch}</text>',
        f'<text class="metric ink" x="536" y="180">ECE {pct(focal_rdrop["ece"])} · macro-F1 {pct(focal_rdrop["f1"])}</text>',
        '<rect class="panel" x="976" y="112" width="444" height="84" rx="12"/>',
        '<text class="small muted" x="1004" y="143">Matched cumulative compute estimate</text>',
        f'<text class="metric ink" x="1004" y="178">{estimated_flops / 1e15:.2f} × 10¹⁵ FLOPs</text>',
        '<text class="heading ink" x="100" y="226">Calibration curve</text>',
        '<text class="heading ink" x="910" y="226">Confidence distribution</text>',
    ]

    for tick in np.linspace(0.0, 1.0, 6):
        y = rel_y(float(tick))
        parts.append(
            f'<line class="grid" x1="{rel_left}" y1="{y:.1f}" x2="{rel_right}" y2="{y:.1f}" stroke-width="1"/>'
        )
        parts.append(
            f'<text class="small muted" x="{rel_left - 18}" y="{y + 6:.1f}" text-anchor="end">{tick:.1f}</text>'
        )
        x = rel_x(float(tick))
        parts.append(
            f'<text class="small muted" x="{x:.1f}" y="{plot_bottom + 30}" text-anchor="middle">{tick:.1f}</text>'
        )
    parts.extend(
        [
            f'<line class="axis" x1="{rel_left}" y1="{plot_bottom}" x2="{rel_right}" y2="{plot_bottom}" stroke-width="2"/>',
            f'<line class="axis" x1="{rel_left}" y1="{plot_top}" x2="{rel_left}" y2="{plot_bottom}" stroke-width="2"/>',
            f'<line class="ideal" x1="{rel_x(0):.1f}" y1="{rel_y(0):.1f}" x2="{rel_x(1):.1f}" y2="{rel_y(1):.1f}" stroke-width="2"/>',
            f'<text class="small muted" x="{rel_right - 8}" y="{plot_top + 26}" text-anchor="end">perfect calibration</text>',
            f'<text class="small muted" x="{(rel_left + rel_right) / 2:.1f}" y="{plot_bottom + 62}" text-anchor="middle">mean confidence</text>',
            f'<text class="small muted" x="34" y="{(plot_top + plot_bottom) / 2:.1f}" text-anchor="middle" transform="rotate(-90 34 {(plot_top + plot_bottom) / 2:.1f})">empirical accuracy</text>',
        ]
    )

    for stats, stroke, fill in (
        (ce, "ce-stroke", "ce-fill"),
        (focal_rdrop, "robust-stroke", "robust-fill"),
    ):
        valid = [point for point in stats["reliability"] if point["accuracy"] is not None]
        line_points = " ".join(
            f'{rel_x(point["confidence"]):.1f},{rel_y(point["accuracy"]):.1f}' for point in valid
        )
        parts.append(
            f'<polyline points="{line_points}" fill="none" class="{stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
        )
        for point in valid:
            parts.append(
                f'<circle class="{fill}" cx="{rel_x(point["confidence"]):.1f}" cy="{rel_y(point["accuracy"]):.1f}" r="6"/>'
            )

    hist_ticks = [0.0, hist_max / 2, hist_max]
    for tick in hist_ticks:
        y = hist_y(float(tick))
        parts.append(
            f'<line class="grid" x1="{hist_left}" y1="{y:.1f}" x2="{hist_right}" y2="{y:.1f}" stroke-width="1"/>'
        )
        parts.append(
            f'<text class="small muted" x="{hist_left - 16}" y="{y + 6:.1f}" text-anchor="end">{tick * 100:.0f}%</text>'
        )
    parts.extend(
        [
            f'<line class="axis" x1="{hist_left}" y1="{plot_bottom}" x2="{hist_right}" y2="{plot_bottom}" stroke-width="2"/>',
            f'<line class="axis" x1="{hist_left}" y1="{plot_top}" x2="{hist_left}" y2="{plot_bottom}" stroke-width="2"/>',
        ]
    )
    bin_width = (hist_right - hist_left) / 15
    for index, (ce_point, robust_point) in enumerate(
        zip(ce["reliability"], focal_rdrop["reliability"])
    ):
        x = hist_left + index * bin_width
        ce_height = plot_bottom - hist_y(ce_point["fraction"])
        robust_height = plot_bottom - hist_y(robust_point["fraction"])
        parts.append(
            f'<rect class="ce-fill" x="{x + 2:.1f}" y="{plot_bottom - ce_height:.1f}" width="{bin_width / 2 - 3:.1f}" height="{ce_height:.1f}" opacity=".82"/>'
        )
        parts.append(
            f'<rect class="robust-fill" x="{x + bin_width / 2 + 1:.1f}" y="{plot_bottom - robust_height:.1f}" width="{bin_width / 2 - 3:.1f}" height="{robust_height:.1f}" opacity=".82"/>'
        )
    for tick in np.linspace(0.0, 1.0, 6):
        x = hist_x(float(tick))
        parts.append(
            f'<text class="small muted" x="{x:.1f}" y="{plot_bottom + 30}" text-anchor="middle">{tick:.1f}</text>'
        )
    parts.extend(
        [
            f'<text class="small muted" x="{(hist_left + hist_right) / 2:.1f}" y="{plot_bottom + 62}" text-anchor="middle">prediction confidence</text>',
            '<text class="note muted" x="80" y="850">Equal compute is based on the experiment’s cumulative FLOPs estimate: one CE forward pass for 20 epochs versus two stochastic Focal + R-Drop passes for 10 epochs.</text>',
            '</svg>',
        ]
    )
    write_svg(output, parts)


def curve_points(
    rows: list[dict[str, float]], key: str, x_position, y_position
) -> str:
    return " ".join(
        f'{x_position(row["epoch"]):.1f},{y_position(row[key]):.1f}' for row in rows
    )


def training_svg(
    output: Path,
    series: list[tuple[str, str, list[dict[str, float]]]],
    n: int,
) -> None:
    width, height = 1500, 920
    top, bottom = 190, 670
    left_a, right_a = 90, 710
    left_b, right_b = 810, 1430
    ece_max = max(row["val_ece"] for _, _, rows in series for row in rows) * 1.08
    f1_min = min(row["val_f1"] for _, _, rows in series for row in rows)
    f1_max = max(row["val_f1"] for _, _, rows in series for row in rows)
    f1_floor = max(0.0, f1_min - 0.025)
    f1_ceiling = min(1.0, f1_max + 0.015)

    def x_left(epoch: float) -> float:
        return left_a + (epoch - 1) / 29 * (right_a - left_a)

    def x_right(epoch: float) -> float:
        return left_b + (epoch - 1) / 29 * (right_b - left_b)

    def y_ece(value: float) -> float:
        return bottom - value / ece_max * (bottom - top)

    def y_f1(value: float) -> float:
        return bottom - (value - f1_floor) / (f1_ceiling - f1_floor) * (bottom - top)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">ISIC calibration and macro F1 across training</title>',
        '<desc id="desc">Validation ECE and macro F1 across 30 epochs for cross entropy, Focal plus R-Drop, and adaptive robust training, with each method’s best observed checkpoint marked.</desc>',
        svg_style(),
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        '<text class="title ink" x="80" y="58">Calibration and classification across training</text>',
        f'<text class="subtitle muted" x="80" y="88">ConvNeXt V2-Tiny · ISIC fold 3 · n={n:,} · seed 42 · validation after every epoch</text>',
        '<text class="heading ink" x="90" y="163">Expected calibration error ↓</text>',
        '<text class="heading ink" x="810" y="163">Macro-F1 ↑</text>',
    ]
    legend_x = [805, 1010, 1280]
    for x, (name, css, _) in zip(legend_x, series):
        parts.append(f'<circle class="{css}-fill" cx="{x}" cy="58" r="7"/>')
        parts.append(f'<text class="small ink" x="{x + 17}" y="64">{html.escape(name)}</text>')

    for fraction in np.linspace(0.0, 1.0, 5):
        ece_value = ece_max * fraction
        y = y_ece(float(ece_value))
        parts.append(
            f'<line class="grid" x1="{left_a}" y1="{y:.1f}" x2="{right_a}" y2="{y:.1f}" stroke-width="1"/>'
        )
        parts.append(
            f'<text class="small muted" x="{left_a - 15}" y="{y + 6:.1f}" text-anchor="end">{ece_value * 100:.0f}%</text>'
        )
        f1_value = f1_floor + (f1_ceiling - f1_floor) * fraction
        y2 = y_f1(float(f1_value))
        parts.append(
            f'<line class="grid" x1="{left_b}" y1="{y2:.1f}" x2="{right_b}" y2="{y2:.1f}" stroke-width="1"/>'
        )
        parts.append(
            f'<text class="small muted" x="{left_b - 15}" y="{y2 + 6:.1f}" text-anchor="end">{f1_value * 100:.0f}%</text>'
        )
    for epoch in (1, 5, 10, 15, 20, 25, 30):
        parts.append(
            f'<text class="small muted" x="{x_left(epoch):.1f}" y="{bottom + 32}" text-anchor="middle">{epoch}</text>'
        )
        parts.append(
            f'<text class="small muted" x="{x_right(epoch):.1f}" y="{bottom + 32}" text-anchor="middle">{epoch}</text>'
        )
    parts.extend(
        [
            f'<line class="axis" x1="{left_a}" y1="{top}" x2="{left_a}" y2="{bottom}" stroke-width="2"/>',
            f'<line class="axis" x1="{left_a}" y1="{bottom}" x2="{right_a}" y2="{bottom}" stroke-width="2"/>',
            f'<line class="axis" x1="{left_b}" y1="{top}" x2="{left_b}" y2="{bottom}" stroke-width="2"/>',
            f'<line class="axis" x1="{left_b}" y1="{bottom}" x2="{right_b}" y2="{bottom}" stroke-width="2"/>',
            f'<text class="small muted" x="{(left_a + right_a) / 2:.1f}" y="{bottom + 66}" text-anchor="middle">epoch</text>',
            f'<text class="small muted" x="{(left_b + right_b) / 2:.1f}" y="{bottom + 66}" text-anchor="middle">epoch</text>',
        ]
    )

    best_rows = []
    for name, css, rows in series:
        parts.append(
            f'<polyline points="{curve_points(rows, "val_ece", x_left, y_ece)}" fill="none" class="{css}-stroke" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
        )
        parts.append(
            f'<polyline points="{curve_points(rows, "val_f1", x_right, y_f1)}" fill="none" class="{css}-stroke" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
        )
        best_ece = min(rows, key=lambda row: row["val_ece"])
        best_f1 = max(rows, key=lambda row: row["val_f1"])
        parts.append(
            f'<circle class="{css}-fill" cx="{x_left(best_ece["epoch"]):.1f}" cy="{y_ece(best_ece["val_ece"]):.1f}" r="8" stroke="#f7f5ef" stroke-width="3"/>'
        )
        parts.append(
            f'<circle class="{css}-fill" cx="{x_right(best_f1["epoch"]):.1f}" cy="{y_f1(best_f1["val_f1"]):.1f}" r="8" stroke="#f7f5ef" stroke-width="3"/>'
        )
        best_rows.append((name, css, best_ece, best_f1))

    parts.extend(
        [
            '<rect class="panel" x="80" y="766" width="1340" height="108" rx="12"/>',
            '<text class="small muted" x="105" y="798">Best observed validation checkpoint within 30 epochs</text>',
        ]
    )
    row_x = [105, 530, 955]
    for x, (name, css, best_ece, best_f1) in zip(row_x, best_rows):
        parts.append(f'<circle class="{css}-fill" cx="{x + 6}" cy="830" r="6"/>')
        parts.append(f'<text class="small ink" x="{x + 22}" y="836">{html.escape(name)}</text>')
        parts.append(
            f'<text class="metric ink" x="{x}" y="861">ECE {pct(best_ece["val_ece"])} · e{int(best_ece["epoch"])}</text>'
        )
        parts.append(
            f'<text class="metric ink" x="{x + 215}" y="861">F1 {pct(best_f1["val_f1"])} · e{int(best_f1["epoch"])}</text>'
        )
    parts.append('</svg>')
    write_svg(output, parts)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ce-metrics", type=Path, required=True)
    parser.add_argument("--ce-probs", type=Path, required=True)
    parser.add_argument("--focal-rdrop-metrics", type=Path, required=True)
    parser.add_argument("--focal-rdrop-probs", type=Path, required=True)
    parser.add_argument("--adaptive-metrics", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    ce_rows = read_metrics(args.ce_metrics)
    focal_rdrop_rows = read_metrics(args.focal_rdrop_metrics)
    adaptive_rows = read_metrics(args.adaptive_metrics)
    ce_epoch = epoch_from_probability_path(args.ce_probs)
    focal_rdrop_epoch = epoch_from_probability_path(args.focal_rdrop_probs)
    ce_row = metric_row(ce_rows, ce_epoch)
    focal_rdrop_row = metric_row(focal_rdrop_rows, focal_rdrop_epoch)
    ce_stats = load_probability_stats(args.ce_probs)
    focal_rdrop_stats = load_probability_stats(args.focal_rdrop_probs)

    if not np.array_equal(ce_stats["labels"], focal_rdrop_stats["labels"]):
        raise ValueError("Probability files do not share the same validation labels")
    if not np.isclose(ce_row["cum_flops"], focal_rdrop_row["cum_flops"], rtol=1e-9):
        raise ValueError("The selected checkpoints do not have equal estimated compute")
    for stats, row, name in (
        (ce_stats, ce_row, "CE"),
        (focal_rdrop_stats, focal_rdrop_row, "Focal + R-Drop"),
    ):
        if not np.isclose(stats["ece"], row["val_ece"], atol=1e-6):
            raise ValueError(f"{name} ECE does not match its metric row")
        if not np.isclose(stats["f1"], row["val_f1"], atol=1e-6):
            raise ValueError(f"{name} macro-F1 does not match its metric row")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    reliability_svg(
        args.output_dir / "eat-equal-compute-reliability.svg",
        ce_stats,
        focal_rdrop_stats,
        ce_epoch,
        focal_rdrop_epoch,
        ce_row["cum_flops"],
    )
    training_svg(
        args.output_dir / "eat-training-curves.svg",
        [
            ("CE", "ce", ce_rows),
            ("Focal + R-Drop", "robust", focal_rdrop_rows),
            ("Adaptive robust", "adaptive", adaptive_rows),
        ],
        ce_stats["n"],
    )
    print(
        f"CE e{ce_epoch}: ECE={ce_stats['ece']:.6f}, F1={ce_stats['f1']:.6f}; "
        f"Focal+RDrop e{focal_rdrop_epoch}: ECE={focal_rdrop_stats['ece']:.6f}, "
        f"F1={focal_rdrop_stats['f1']:.6f}; n={ce_stats['n']}; "
        f"compute={ce_row['cum_flops']:.0f}"
    )


if __name__ == "__main__":
    main()
