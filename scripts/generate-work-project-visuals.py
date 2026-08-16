from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch


BG = "#f7f6f2"
SURFACE = "#ffffff"
INK = "#202827"
MUTED = "#566361"
LINE = "#c7ceca"
ACCENT = "#587776"
ACCENT_SOFT = "#dfe9e6"
ORANGE = "#c97846"
BLUE = "#6ca8c7"


def canvas(figsize=(16, 10)):
    fig, ax = plt.subplots(figsize=figsize, facecolor=BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    return fig, ax


def box(ax, x, y, w, h, title, body="", fill=SURFACE, edge=LINE, title_size=17, body_size=12):
    patch = FancyBboxPatch(
        (x, y), w, h, boxstyle="round,pad=0.012,rounding_size=0.018",
        facecolor=fill, edgecolor=edge, linewidth=1.4,
    )
    ax.add_patch(patch)
    ax.text(x + 0.025 * w, y + h - 0.28 * h, title, color=INK, fontsize=title_size, fontweight="bold", va="center")
    if body:
        ax.text(x + 0.025 * w, y + 0.18 * h, body, color=MUTED, fontsize=body_size, va="bottom", linespacing=1.35)
    return patch


def arrow(ax, start, end, color=ACCENT):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=18, linewidth=2.2, color=color))


def header(ax, title, subtitle):
    ax.text(0.05, 0.94, title, fontsize=29, fontweight="bold", color=INK, va="top")
    ax.text(0.05, 0.885, subtitle, fontsize=15, color=MUTED, va="top")
    ax.plot([0.05, 0.95], [0.845, 0.845], color=LINE, linewidth=1.3)


def save(fig, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=160, bbox_inches="tight", facecolor=BG)
    plt.close(fig)


def nlp_pipeline(out):
    fig, ax = canvas()
    header(ax, "Weakly supervised procurement NLP", "From scarce labels to two CPU-served classifiers")
    items = [
        ("Bidability teacher", "RoBERTa-large + LoRA\nFocal · R-Drop · FGM"),
        ("Ontology discovery", "[CLS] 1024d → UMAP\nHDBSCAN + human review"),
        ("Weak labels", "Hard rules + Max-Sim\nSBERT 0.9 · domain model 0.1"),
        ("Multiclass student", "Dynamic label set\nClass weighting · 3-fold F1"),
        ("CPU serving", "Static INT8 ONNX\nParallel FastAPI batch path"),
    ]
    xs = np.linspace(0.05, 0.79, len(items))
    for index, ((title, body), x) in enumerate(zip(items, xs)):
        box(ax, x, 0.49, 0.16, 0.25, title, body, ACCENT_SOFT if index in (0, 2, 4) else SURFACE, title_size=14, body_size=10.5)
        if index < len(items) - 1:
            arrow(ax, (x + 0.16, 0.615), (xs[index + 1] - 0.008, 0.615))
    box(ax, 0.05, 0.17, 0.42, 0.18, "Learning boundary", "Domain representations create the ontology;\nweak labels train the final work-category model.", SURFACE)
    box(ax, 0.53, 0.17, 0.42, 0.18, "Deployment boundary", "Both models are merged, quantized, and\nexecuted concurrently behind one batch API.", SURFACE)
    save(fig, out / "nlp-pipeline.png")


def nlp_benchmark(out):
    labels = ["LLM few-shot", "Fine-tuned classifier", "RAFT", "3-agent path"]
    f1 = np.array([0.350649, 0.963902, 0.349805, 0.963902])
    acc = np.array([0.540, 0.964, 0.538, 0.964])
    y = np.arange(len(labels))
    fig, ax = plt.subplots(figsize=(15, 9), facecolor=BG)
    fig.subplots_adjust(top=0.80, left=0.18, right=0.95, bottom=0.10)
    ax.set_facecolor(BG)
    ax.barh(y + 0.18, f1, height=0.32, color=ACCENT, label="Macro-F1")
    ax.barh(y - 0.18, acc, height=0.32, color=BLUE, label="Accuracy")
    for yy, value in zip(y + 0.18, f1):
        ax.text(value + 0.015, yy, f"{value:.3f}", va="center", fontsize=12, color=INK)
    for yy, value in zip(y - 0.18, acc):
        ax.text(value + 0.015, yy, f"{value:.3f}", va="center", fontsize=12, color=INK)
    ax.set_yticks(y, labels, fontsize=13, color=INK)
    ax.set_xlim(0, 1.08)
    ax.invert_yaxis()
    ax.set_xlabel("Score", fontsize=13, color=MUTED)
    fig.text(0.18, 0.94, "500-record bidability evaluation", fontsize=25, fontweight="bold", color=INK, va="top")
    fig.text(0.18, 0.89, "RoBERTa-large + LoRA reaches 0.9639 Macro-F1 and 96.4% accuracy.", fontsize=14, color=MUTED, va="top")
    ax.grid(axis="x", color=LINE, linewidth=0.8, alpha=0.7)
    ax.spines[:].set_visible(False)
    ax.legend(frameon=False, loc="upper right", fontsize=12)
    save(fig, out / "nlp-benchmark.png")


def r2ccp_method(out):
    x = np.linspace(-4, 4, 800)
    y = 0.53 * np.exp(-0.5 * ((x + 1.45) / 0.62) ** 2) + 0.47 * np.exp(-0.5 * ((x - 1.35) / 0.75) ** 2)
    y /= y.max()
    threshold = 0.33
    fig, axes = plt.subplots(2, 1, figsize=(15, 9), facecolor=BG, sharex=True)
    for ax in axes:
        ax.set_facecolor(BG)
        ax.plot(x, y, color=INK, linewidth=2.5)
        ax.axhline(threshold, color=MUTED, linestyle="--", linewidth=1.3)
        ax.set_ylim(0, 1.15)
        ax.set_yticks([])
        ax.spines[:].set_visible(False)
    axes[0].axvspan(-2.45, 2.55, color=ORANGE, alpha=0.24)
    axes[0].text(-3.8, 1.02, "Collapsed interval", fontsize=17, fontweight="bold", color=INK)
    axes[0].text(-3.8, 0.91, "The low-density gap is included with both modes.", fontsize=12.5, color=MUTED)
    mask = y >= threshold
    left = x[(mask) & (x < 0)]
    right = x[(mask) & (x > 0)]
    axes[1].axvspan(left.min(), left.max(), color=ACCENT, alpha=0.30)
    axes[1].axvspan(right.min(), right.max(), color=ACCENT, alpha=0.30)
    axes[1].text(-3.8, 1.02, "Per-bin conformal set", fontsize=17, fontweight="bold", color=INK)
    axes[1].text(-3.8, 0.91, "Only bins above the calibrated threshold remain; disjoint modes are preserved.", fontsize=12.5, color=MUTED)
    axes[1].set_xlabel("Candidate bid-rate coordinate (synthetic illustration)", fontsize=13, color=MUTED)
    fig.suptitle("Fixing interval collapse in a multimodal prediction", fontsize=26, fontweight="bold", color=INK, x=0.125, ha="left")
    save(fig, out / "r2ccp-method.png")


def r2ccp_coverage(out):
    labels = ["Q1-BRD1", "Q1-BRD2", "Q1-BRD3", "Q1-BRD4", "Q2-BRD1", "Q2-BRD2", "Q2-BRD3", "Q2-BRD4"]
    coverage = np.array([91.39, 92.23, 88.07, 91.21, 86.14, 81.41, 93.92, 94.77])
    lengths = np.array([0.01493, 0.01938, 0.01663, 0.01687, 0.02200, 0.02084, 0.02854, 0.05341])
    x = np.arange(len(labels))
    fig, ax = plt.subplots(figsize=(15, 9), facecolor=BG)
    fig.subplots_adjust(top=0.79, left=0.10, right=0.96, bottom=0.14)
    ax.set_facecolor(BG)
    bars = ax.bar(x, coverage, color=[ACCENT if v >= 90 else BLUE for v in coverage], width=0.68)
    ax.axhline(90.73, color=ORANGE, linewidth=2.2, linestyle="--", label="Weighted coverage 90.73%")
    for bar, cov, length in zip(bars, coverage, lengths):
        ax.text(bar.get_x() + bar.get_width()/2, cov + 0.7, f"{cov:.1f}%", ha="center", fontsize=11.5, color=INK)
        ax.text(bar.get_x() + bar.get_width()/2, 75.8, f"L {length:.3f}", ha="center", fontsize=9.5, color=MUTED, rotation=90)
    ax.set_ylim(78, 100)
    ax.set_xticks(x, labels, fontsize=11, color=INK)
    ax.set_ylabel("Chronological validation coverage (%)", fontsize=13, color=MUTED)
    fig.text(0.10, 0.94, "Eight context models preserve calibrated multi-segment sets", fontsize=25, fontweight="bold", color=INK, va="top")
    fig.text(0.10, 0.89, "13,984 chronological validation samples · 12,688 covered · 69,934 total records", fontsize=13.5, color=MUTED, va="top")
    ax.grid(axis="y", color=LINE, linewidth=0.8, alpha=0.7)
    ax.spines[:].set_visible(False)
    ax.legend(frameon=False, loc="upper left", fontsize=12)
    save(fig, out / "r2ccp-coverage.png")


def ocr_pipeline(out):
    fig, ax = canvas()
    header(ax, "Document AI for HWP and PDF notices", "The LLM copies fields; deterministic code computes money, ratios, and units")
    top = [
        ("Direct download", "URL fetch\nNo browser dependency"),
        ("Magic-byte router", "HWP · HWPX · PDF · ZIP"),
        ("Format parsers", "rhwp · hwp5 · liteparse"),
        ("Source-field copy", "Gemini 2.5 Flash-Lite\nNo arithmetic"),
        ("Deterministic parser", "Amounts · ratios · units"),
    ]
    xs = np.linspace(0.05, 0.79, len(top))
    for i, ((title, body), x) in enumerate(zip(top, xs)):
        box(ax, x, 0.52, 0.16, 0.23, title, body, ACCENT_SOFT if i in (1, 3) else SURFACE, title_size=14, body_size=10.5)
        if i < len(top)-1:
            arrow(ax, (x + 0.16, 0.635), (xs[i+1] - 0.008, 0.635))
    box(ax, 0.05, 0.17, 0.26, 0.19, "Concurrent batch", "Thread pool\nStage-specific timeout", SURFACE)
    box(ax, 0.37, 0.17, 0.26, 0.19, "Recoverable output", "Retry · incremental CSV\nResume after interruption", SURFACE)
    box(ax, 0.69, 0.17, 0.26, 0.19, "Observable failures", "Structured logs\nFormat and stage attribution", SURFACE)
    save(fig, out / "ocr-pipeline.png")


def ocr_results(out):
    fig, ax = canvas()
    ax.text(0.05, 0.91, "Document extraction results", fontsize=29, fontweight="bold", color=INK, va="top")
    ax.text(0.05, 0.855, "An anonymized batch of mixed HWP/HWPX, PDF, and ZIP notices", fontsize=15, color=MUTED, va="top")
    ax.plot([0.05, 0.95], [0.815, 0.815], color=LINE, linewidth=1.3)
    cards = [
        ("199 / 199", "documents extracted"),
        ("2.14M", "tokens processed"),
        ("~90%", "license-ratio GT agreement"),
        ("~$0.82", "documented batch cost"),
    ]
    for i, (value, label) in enumerate(cards):
        x = 0.05 + i * 0.23
        box(ax, x, 0.54, 0.20, 0.23, value, label, ACCENT_SOFT if i in (0, 2) else SURFACE, title_size=27, body_size=12)
    ax.text(0.05, 0.39, "Why the accuracy moved", fontsize=18, fontweight="bold", color=INK)
    stages = ["LLM performs\nfield copying", "Code performs\narithmetic", "Structured errors\nreturn to the right stage"]
    for i, text in enumerate(stages):
        x = 0.05 + i * 0.31
        box(ax, x, 0.15, 0.27, 0.16, f"0{i+1}", text, SURFACE, title_size=18, body_size=11.5)
        if i < 2:
            arrow(ax, (x + 0.27, 0.23), (x + 0.30, 0.23))
    save(fig, out / "ocr-results.png")


def decision_pipeline(out):
    fig, ax = canvas()
    header(ax, "Uncertainty-aware bid decision pipeline", "1,000-quantile forecasts become Monte Carlo decisions, then pass deployment gates")
    stages = [
        ("Common coordinate", "63-feature schema\nAffine target mapping"),
        ("Quantile models", "XGBoost · CatBoost\nTabICLv2 routing"),
        ("q1000 interface", "0.001 → 0.999\nCalibrated distributions"),
        ("Regional MC", "100 · 300 · 50 draws\nValidity + lowest-price P"),
        ("Policy evaluation", "Time split · rank signal\nOperating constraints"),
        ("Gated deployment", "Manifest · SHA256\nDry-run · explicit approval"),
    ]
    positions = [(0.05, 0.57), (0.365, 0.57), (0.68, 0.57), (0.68, 0.34), (0.365, 0.34), (0.05, 0.34)]
    for i, ((title, body), (x, y)) in enumerate(zip(stages, positions)):
        box(ax, x, y, 0.27, 0.17, title, body, ACCENT_SOFT if i in (1, 3, 5) else SURFACE, title_size=15, body_size=10.5)
    arrow(ax, (0.32, 0.655), (0.355, 0.655))
    arrow(ax, (0.635, 0.655), (0.67, 0.655))
    arrow(ax, (0.815, 0.57), (0.815, 0.52))
    arrow(ax, (0.68, 0.425), (0.645, 0.425))
    arrow(ax, (0.365, 0.425), (0.33, 0.425))
    checks = ["feature schema", "model + calibration manifest", "JAC depth", "artifact size", "SHA256", "approved write"]
    ax.text(0.05, 0.25, "Deployment evidence gate", fontsize=18, fontweight="bold", color=INK)
    for i, label in enumerate(checks):
        x = 0.05 + (i % 3) * 0.30
        y = 0.145 - (i // 3) * 0.09
        ax.add_patch(FancyBboxPatch((x, y), 0.26, 0.06, boxstyle="round,pad=0.009,rounding_size=0.015", facecolor=SURFACE, edgecolor=LINE))
        ax.text(x + 0.025, y + 0.038, "✓", fontsize=16, color=ACCENT, fontweight="bold", va="center")
        ax.text(x + 0.06, y + 0.038, label, fontsize=11.5, color=INK, va="center")
    save(fig, out / "decision-pipeline.png")


def uq_model_map(out):
    fig, ax = canvas()
    header(ax, "Model portfolio and uncertainty roles", "Active candidates are separated from research implementations and evaluation baselines")
    box(ax, 0.05, 0.50, 0.42, 0.28, "Active candidate families", "XGBoost quantile regression\nCatBoost quantile regression\nTabICLv2 routed predictors", ACCENT_SOFT, title_size=20, body_size=15)
    box(ax, 0.53, 0.50, 0.42, 0.28, "Evaluated UQ families", "R2CCP · CREPES conformal\nNGBoost · XGBoostLSS\nRealMLP", SURFACE, title_size=20, body_size=15)
    box(ax, 0.05, 0.18, 0.27, 0.18, "Distribution quality", "CRPS\nPinball loss", SURFACE, title_size=17, body_size=14)
    box(ax, 0.365, 0.18, 0.27, 0.18, "Decision quality", "Validity probability\nLowest-price probability", SURFACE, title_size=17, body_size=14)
    box(ax, 0.68, 0.18, 0.27, 0.18, "Operational quality", "Time-split replay\nArtifact verification", SURFACE, title_size=17, body_size=14)
    arrow(ax, (0.26, 0.50), (0.19, 0.36))
    arrow(ax, (0.74, 0.50), (0.82, 0.36))
    arrow(ax, (0.50, 0.50), (0.50, 0.36))
    save(fig, out / "uq-model-map.png")


def main():
    root = Path(__file__).resolve().parents[1] / "public" / "img" / "projects"
    nlp = root / "procurement-nlp"
    r2ccp = root / "r2ccp-bid-prediction"
    ocr = root / "document-ai-ocr"
    decision = root / "probabilistic-bid-mlops"
    nlp_pipeline(nlp)
    nlp_benchmark(nlp)
    r2ccp_method(r2ccp)
    r2ccp_coverage(r2ccp)
    ocr_pipeline(ocr)
    ocr_results(ocr)
    decision_pipeline(decision)
    uq_model_map(decision)


if __name__ == "__main__":
    main()
