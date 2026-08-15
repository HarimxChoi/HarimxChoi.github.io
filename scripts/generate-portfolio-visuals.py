import argparse
import math
import re
import sys
from datetime import date
from pathlib import Path


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def parse_wsss(training_log: Path, eval_log: Path) -> tuple[list[float], float]:
    training = read_text(training_log)
    values = [float(value) * 100 for value in re.findall(r"\[VAL\] mIoU:([0-9.]+)", training)]
    if len(values) < 3:
        raise ValueError("Expected at least three WSSS validation points")

    evaluation = read_text(eval_log)
    aggregate = [float(value) * 100 for value in re.findall(r"'miou':\s*([0-9.]+)", evaluation)]
    if not aggregate:
        raise ValueError("No aggregate WSSS mIoU found")

    return values[-3:], aggregate[-1]


def generate_wsss(training_log: Path, eval_log: Path, output: Path, baseline: float) -> None:
    validation, full_eval = parse_wsss(training_log, eval_log)
    labels = ["60k", "70k", "80k", "Full eval"]
    scores = [*validation, full_eval]
    width, height = 1200, 660
    left, right, top, bottom = 112, 60, 108, 126
    plot_width = width - left - right
    plot_height = height - top - bottom
    y_min = min(baseline, *scores) - 0.55
    y_max = max(scores) + 0.65

    def x_pos(index: int) -> float:
        return left + plot_width * index / (len(scores) - 1)

    def y_pos(value: float) -> float:
        return top + (y_max - value) * plot_height / (y_max - y_min)

    points = " ".join(f"{x_pos(index):.1f},{y_pos(score):.1f}" for index, score in enumerate(scores))
    area = f"{x_pos(0):.1f},{y_pos(baseline):.1f} {points} {x_pos(len(scores) - 1):.1f},{y_pos(baseline):.1f}"
    grid_values = [51.5, 52.0, 52.5, 53.0, 53.5]

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Weakly supervised segmentation performance on COCO-Val</title>',
        '<desc id="desc">Validation mIoU rises from 51.92 at 60 thousand iterations to 53.31 on the full 40,137 image evaluation, 1.5 percentage points above WeCLIP+.</desc>',
        """<style>
          .bg{fill:#f7f5ef}.ink{fill:#272b31}.muted{fill:#6d7480}.grid{stroke:#d8d4ca}.axis{stroke:#a8a49a}.accent{stroke:#c25a35}.accent-fill{fill:#c25a35}.area{fill:#c25a35;opacity:.10}.baseline{stroke:#6d7480;stroke-dasharray:9 8}.label{font:24px ui-sans-serif,system-ui,sans-serif}.small{font:19px ui-sans-serif,system-ui,sans-serif}.value{font:600 22px ui-monospace,SFMono-Regular,monospace}.title{font:600 34px ui-sans-serif,system-ui,sans-serif}
          @media (prefers-color-scheme:dark){.bg{fill:#1d1f21}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.grid{stroke:#3b3d40}.axis{stroke:#66686b}.accent{stroke:#e07a56}.accent-fill{fill:#e07a56}.area{fill:#e07a56}.baseline{stroke:#a7a9ad}}
        </style>""",
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        f'<text class="title ink" x="{left}" y="54">Weakly supervised segmentation on COCO-Val</text>',
        f'<text class="small muted" x="{left}" y="84">mIoU across training checkpoints and the full 40,137-image evaluation</text>',
    ]

    for value in grid_values:
        y = y_pos(value)
        parts.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{width - right}" y2="{y:.1f}" stroke-width="1"/>')
        parts.append(f'<text class="small muted" x="{left - 20}" y="{y + 7:.1f}" text-anchor="end">{value:.1f}</text>')

    baseline_y = y_pos(baseline)
    parts.extend(
        [
            f'<polygon class="area" points="{area}"/>',
            f'<line class="baseline" x1="{left}" y1="{baseline_y:.1f}" x2="{width - right}" y2="{baseline_y:.1f}" stroke-width="2"/>',
            f'<text class="small muted" x="{width - right}" y="{baseline_y - 12:.1f}" text-anchor="end">WeCLIP+ {baseline:.1f}</text>',
            f'<polyline points="{points}" fill="none" class="accent" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
        ]
    )

    for index, (label, score) in enumerate(zip(labels, scores)):
        x = x_pos(index)
        y = y_pos(score)
        parts.extend(
            [
                f'<circle class="accent-fill" cx="{x:.1f}" cy="{y:.1f}" r="8"/>',
                f'<text class="value ink" x="{x:.1f}" y="{y - 22:.1f}" text-anchor="middle">{score:.2f}</text>',
                f'<text class="label ink" x="{x:.1f}" y="{height - 82}" text-anchor="middle">{label}</text>',
            ]
        )

    parts.extend(
        [
            f'<text class="value accent-fill" x="{x_pos(3):.1f}" y="{y_pos(full_eval) + 44:.1f}" text-anchor="middle">+{full_eval - baseline:.1f} pp</text>',
            f'<line class="axis" x1="{left}" y1="{height - bottom}" x2="{width - right}" y2="{height - bottom}" stroke-width="1.5"/>',
            f'<text class="small muted" x="{left}" y="{height - 30}">Multi-scale + flip evaluation on all COCO-Val 2014 images</text>',
            "</svg>",
        ]
    )

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def _path_points(values: list[float], left: float, top: float, width: float, height: float, low: float, high: float) -> str:
    span = high - low
    return " ".join(
        f"{left + width * index / max(1, len(values) - 1):.1f},{top + (high - value) * height / span:.1f}"
        for index, value in enumerate(values)
    )


def _emh_paths(repo: Path, dataset: Path, models: Path) -> tuple[list[date], list[float], list[float]]:
    sys.path.insert(0, str(repo / "src"))
    import numpy as np
    from sb3_contrib import TQC

    from emh_agent.data import load_dataset
    from emh_agent.environment import WINDOWS, decision_indices
    from emh_agent.evaluate import _evaluate_model
    from emh_agent.train import SEEDS

    panel = load_dataset(dataset)
    paths = []
    for seed in SEEDS:
        model = TQC.load(models / f"tqc-seed-{seed}.zip", device="cpu")
        paths.append(_evaluate_model(model, panel))
    returns = np.mean(np.vstack([path["returns"] for path in paths]), axis=0)
    benchmark = np.mean(np.vstack([path["benchmark"] for path in paths]), axis=0)
    start, end = WINDOWS["validation"]
    dates = [
        panel.dates[index + offset]
        for index in decision_indices(panel, start, end)
        for offset in range(1, 22)
    ]
    if len(dates) != len(returns):
        raise ValueError("EMH return and date lengths differ")
    return dates, returns.tolist(), benchmark.tolist()


def _wealth(returns: list[float]) -> list[float]:
    values = [1.0]
    for value in returns:
        values.append(values[-1] * (1 + value))
    return values[1:]


def _drawdown(wealth: list[float]) -> list[float]:
    peak = 0.0
    values = []
    for value in wealth:
        peak = max(peak, value)
        values.append(value / peak - 1)
    return values


def _annual_metrics(dates: list[date], returns: list[float]) -> dict[int, tuple[float, float]]:
    result = {}
    for year in sorted({value.year for value in dates}):
        selected = [value for day, value in zip(dates, returns) if day.year == year]
        wealth = _wealth(selected)
        result[year] = (wealth[-1] - 1, min(_drawdown(wealth)))
    return result


def generate_emh_cumulative(repo: Path, dates: list[date], candidate: list[float], benchmark: list[float], output: Path) -> None:
    candidate_wealth = _wealth(candidate)
    benchmark_wealth = _wealth(benchmark)
    candidate_drawdown = _drawdown(candidate_wealth)
    benchmark_drawdown = _drawdown(benchmark_wealth)
    width, height = 1200, 760
    left, right = 116, 64
    wealth_top, wealth_height = 122, 322
    draw_top, draw_height = 516, 130
    plot_width = width - left - right
    wealth_max = max(candidate_wealth + benchmark_wealth) * 1.07
    wealth_min = min(candidate_wealth + benchmark_wealth) * 0.95
    draw_min = min(candidate_drawdown + benchmark_drawdown) * 1.08

    candidate_path = _path_points(candidate_wealth, left, wealth_top, plot_width, wealth_height, wealth_min, wealth_max)
    benchmark_path = _path_points(benchmark_wealth, left, wealth_top, plot_width, wealth_height, wealth_min, wealth_max)
    candidate_dd_path = _path_points(candidate_drawdown, left, draw_top, plot_width, draw_height, draw_min, 0)
    benchmark_dd_path = _path_points(benchmark_drawdown, left, draw_top, plot_width, draw_height, draw_min, 0)
    years = [2019, 2020, 2021]
    year_x = {}
    for year in years:
        index = min(range(len(dates)), key=lambda i: abs((dates[i] - date(year, 1, 1)).days))
        year_x[year] = left + plot_width * index / (len(dates) - 1)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Cost-aware TQC validation against the S&amp;P 500</title>',
        '<desc id="desc">A three-seed TQC ensemble is compared with IVV over 756 held-out trading sessions from 2019 through 2021, including cumulative wealth and drawdown.</desc>',
        """<style>
          .bg{fill:#f7f5ef}.ink{fill:#272b31}.muted{fill:#6d7480}.grid{stroke:#d8d4ca}.candidate{stroke:#c25a35}.benchmark{stroke:#557a92}.fill-candidate{fill:#c25a35}.fill-benchmark{fill:#557a92}.label{font:20px ui-sans-serif,system-ui,sans-serif}.small{font:17px ui-sans-serif,system-ui,sans-serif}.value{font:600 20px ui-monospace,SFMono-Regular,monospace}.title{font:600 32px ui-sans-serif,system-ui,sans-serif}
          @media (prefers-color-scheme:dark){.bg{fill:#1d1f21}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.grid{stroke:#3b3d40}.candidate{stroke:#e07a56}.benchmark{stroke:#72a3be}.fill-candidate{fill:#e07a56}.fill-benchmark{fill:#72a3be}}
        </style>""",
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        f'<text class="title ink" x="{left}" y="52">Cost-aware historical validation</text>',
        f'<text class="small muted" x="{left}" y="82">TQC 3-seed ensemble vs. IVV · 756 held-out trading sessions · 2019–2021</text>',
    ]
    for value in [1.0, 1.5, 2.0, 2.5, 3.0]:
        if wealth_min <= value <= wealth_max:
            y = wealth_top + (wealth_max - value) * wealth_height / (wealth_max - wealth_min)
            parts.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{width-right}" y2="{y:.1f}"/>')
            parts.append(f'<text class="small muted" x="{left-18}" y="{y+6:.1f}" text-anchor="end">{value:.1f}×</text>')
    for value in [0, -0.1, -0.2, -0.3]:
        if draw_min <= value <= 0:
            y = draw_top + (0 - value) * draw_height / (0 - draw_min)
            parts.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{width-right}" y2="{y:.1f}"/>')
            parts.append(f'<text class="small muted" x="{left-18}" y="{y+6:.1f}" text-anchor="end">{value*100:.0f}%</text>')
    for year, x in year_x.items():
        parts.extend([
            f'<line class="grid" x1="{x:.1f}" y1="{wealth_top}" x2="{x:.1f}" y2="{wealth_top+wealth_height}"/>',
            f'<line class="grid" x1="{x:.1f}" y1="{draw_top}" x2="{x:.1f}" y2="{draw_top+draw_height}"/>',
            f'<text class="small muted" x="{x:.1f}" y="{height-64}" text-anchor="middle">{year}</text>',
        ])
    parts.extend([
        f'<polyline points="{benchmark_path}" fill="none" class="benchmark" stroke-width="4" stroke-linejoin="round"/>',
        f'<polyline points="{candidate_path}" fill="none" class="candidate" stroke-width="5" stroke-linejoin="round"/>',
        f'<polyline points="{benchmark_dd_path}" fill="none" class="benchmark" stroke-width="3" stroke-linejoin="round"/>',
        f'<polyline points="{candidate_dd_path}" fill="none" class="candidate" stroke-width="4" stroke-linejoin="round"/>',
        f'<text class="small muted" x="{left}" y="{draw_top-22}">Drawdown</text>',
        f'<circle class="fill-candidate" cx="{left}" cy="{height-22}" r="6"/><text class="label ink" x="{left+16}" y="{height-15}">TQC ensemble  +{(candidate_wealth[-1]-1)*100:.1f}% · MDD {min(candidate_drawdown)*100:.1f}%</text>',
        f'<circle class="fill-benchmark" cx="{left+480}" cy="{height-22}" r="6"/><text class="label ink" x="{left+496}" y="{height-15}">IVV  +{(benchmark_wealth[-1]-1)*100:.1f}% · MDD {min(benchmark_drawdown)*100:.1f}%</text>',
        '</svg>',
    ])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def generate_emh_yearly(dates: list[date], candidate: list[float], benchmark: list[float], output: Path) -> None:
    candidate_years = _annual_metrics(dates, candidate)
    benchmark_years = _annual_metrics(dates, benchmark)
    years = sorted(candidate_years)
    width, height = 1200, 680
    left, right, top, bottom = 112, 72, 122, 172
    plot_width = width - left - right
    plot_height = height - top - bottom
    y_max = 0.65

    def y_pos(value: float) -> float:
        return top + (y_max - value) * plot_height / y_max

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Year-by-year TQC and IVV returns</title>',
        '<desc id="desc">Annual return and maximum drawdown are compared for 2019, 2020, and 2021.</desc>',
        """<style>
          .bg{fill:#f7f5ef}.ink{fill:#272b31}.muted{fill:#6d7480}.grid{stroke:#d8d4ca}.candidate{fill:#c25a35}.benchmark{fill:#557a92}.label{font:20px ui-sans-serif,system-ui,sans-serif}.small{font:17px ui-sans-serif,system-ui,sans-serif}.value{font:600 20px ui-monospace,SFMono-Regular,monospace}.title{font:600 32px ui-sans-serif,system-ui,sans-serif}
          @media (prefers-color-scheme:dark){.bg{fill:#1d1f21}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.grid{stroke:#3b3d40}.candidate{fill:#e07a56}.benchmark{fill:#72a3be}}
        </style>""",
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        f'<text class="title ink" x="{left}" y="52">Where the return and risk came from</text>',
        f'<text class="small muted" x="{left}" y="82">Annual return above · maximum drawdown below each year</text>',
    ]
    for value in [0, 0.2, 0.4, 0.6]:
        y = y_pos(value)
        parts.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{width-right}" y2="{y:.1f}"/>')
        parts.append(f'<text class="small muted" x="{left-18}" y="{y+6:.1f}" text-anchor="end">{value*100:.0f}%</text>')
    group_width = plot_width / len(years)
    for index, year in enumerate(years):
        center = left + group_width * (index + 0.5)
        bar_width = 94
        candidate_return, candidate_mdd = candidate_years[year]
        benchmark_return, benchmark_mdd = benchmark_years[year]
        for x, value, kind in [
            (center - bar_width - 8, candidate_return, "candidate"),
            (center + 8, benchmark_return, "benchmark"),
        ]:
            y = y_pos(value)
            parts.append(f'<rect class="{kind}" x="{x:.1f}" y="{y:.1f}" width="{bar_width}" height="{top+plot_height-y:.1f}" rx="6"/>')
            parts.append(f'<text class="value ink" x="{x+bar_width/2:.1f}" y="{y-12:.1f}" text-anchor="middle">{value*100:.1f}%</text>')
        parts.extend([
            f'<text class="label ink" x="{center:.1f}" y="{top+plot_height+42}" text-anchor="middle">{year}</text>',
            f'<text class="small muted" x="{center:.1f}" y="{top+plot_height+76}" text-anchor="middle">MDD {candidate_mdd*100:.1f}% / {benchmark_mdd*100:.1f}%</text>',
        ])
    parts.extend([
        f'<rect class="candidate" x="{left}" y="{height-34}" width="18" height="18" rx="3"/><text class="label ink" x="{left+30}" y="{height-18}">TQC 3-seed ensemble</text>',
        f'<rect class="benchmark" x="{left+330}" y="{height-34}" width="18" height="18" rx="3"/><text class="label ink" x="{left+360}" y="{height-18}">IVV</text>',
        '</svg>',
    ])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def generate_emh(repo: Path, dataset: Path, models: Path, output_dir: Path) -> None:
    dates, candidate, benchmark = _emh_paths(repo, dataset, models)
    generate_emh_cumulative(repo, dates, candidate, benchmark, output_dir / "emh-cumulative.svg")
    generate_emh_yearly(dates, candidate, benchmark, output_dir / "emh-yearly.svg")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--wsss-training-log", type=Path)
    parser.add_argument("--wsss-eval-log", type=Path)
    parser.add_argument("--wsss-output", type=Path)
    parser.add_argument("--wsss-baseline", type=float, default=51.8)
    parser.add_argument("--emh-repo", type=Path)
    parser.add_argument("--emh-dataset", type=Path)
    parser.add_argument("--emh-models", type=Path)
    parser.add_argument("--emh-output-dir", type=Path)
    args = parser.parse_args()

    required = [args.wsss_training_log, args.wsss_eval_log, args.wsss_output]
    if all(required):
        generate_wsss(
            args.wsss_training_log,
            args.wsss_eval_log,
            args.wsss_output,
            args.wsss_baseline,
        )
        return

    emh_required = [args.emh_repo, args.emh_dataset, args.emh_models, args.emh_output_dir]
    if all(emh_required):
        generate_emh(args.emh_repo, args.emh_dataset, args.emh_models, args.emh_output_dir)
        return

    parser.error("Provide either WSSS logs/output or the EMH repo/dataset/models/output directory")


if __name__ == "__main__":
    main()
