import numpy as np
import matplotlib.pyplot as plt
from matplotlib import font_manager
from scipy.stats import norm
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "img" / "r2ccp-comparison.png"

x = np.linspace(-4, 4, 400)
density = 0.5 * norm.pdf(x, loc=-1.5, scale=0.5) + 0.5 * norm.pdf(x, loc=1.5, scale=0.5)
density = density / density.max() * 0.9

threshold = 0.30

INK = "#0a0a0a"
MUTED = "#525252"
GRID = "#a1a1aa"
INDIGO = "#6366f1"
CORAL = "#fb7185"

fig, axes = plt.subplots(1, 2, figsize=(11, 4.2), sharey=True)
fig.patch.set_facecolor("white")

titles = [
    "pip R2CCP: cumulative interval\nbimodal collapses into one wide interval",
    "r2ccp_2: per-bin threshold + entropy reg\nbimodal preserved as two disjoint intervals",
]

for ax, title, mode in zip(axes, titles, ["pip", "custom"]):
    ax.plot(x, density, color=INK, linewidth=2.0, label="softmax(P | y)")
    ax.axhline(threshold, color=MUTED, linestyle="--", alpha=0.7, linewidth=1.0)
    ax.text(-3.9, threshold + 0.02, "threshold", fontsize=8.5, color=MUTED)

    if mode == "pip":
        lo, hi = -2.6, 2.6
        ax.fill_between(x, 0, density, where=(x >= lo) & (x <= hi),
                        color=CORAL, alpha=0.30)
        ax.fill_between(x, 0, threshold, where=(x >= lo) & (x <= hi),
                        color=CORAL, alpha=0.18)
        for xv in (lo, hi):
            ax.axvline(xv, color=CORAL, linewidth=1.4, alpha=0.85)
        ax.text(0, 0.15, "1 interval\n(covers empty\nspace too)",
                ha="center", va="center", fontsize=9, color="#9f1239",
                style="italic")
    else:
        bands = [(-2.6, -0.45), (0.45, 2.6)]
        for lo, hi in bands:
            mask = (x >= lo) & (x <= hi)
            ax.fill_between(x, 0, density, where=mask,
                            color=INDIGO, alpha=0.35)
            for xv in (lo, hi):
                ax.axvline(xv, color=INDIGO, linewidth=1.4, alpha=0.85)
        ax.text(-1.5, 0.55, "interval 1",
                ha="center", fontsize=9, color="#3730a3", style="italic")
        ax.text(1.5, 0.55, "interval 2",
                ha="center", fontsize=9, color="#3730a3", style="italic")

    ax.set_title(title, fontsize=10.5, color=INK, pad=14, loc="left")
    ax.set_xlabel("y", fontsize=10, color=MUTED)
    ax.set_xlim(-4, 4)
    ax.set_ylim(0, 1.05)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(GRID)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(colors=MUTED, labelsize=9)
    ax.set_yticks([])

axes[0].set_ylabel("predicted prob.", fontsize=10, color=MUTED)

fig.text(0.5, -0.03,
         "Mock bimodal y distribution · threshold marked.   "
         "pip R2CCP includes the empty space between modes; r2ccp_2 keeps the two peaks separate.",
         ha="center", fontsize=8.5, color=MUTED, style="italic")

plt.tight_layout()
OUT.parent.mkdir(parents=True, exist_ok=True)
plt.savefig(OUT, dpi=170, bbox_inches="tight",
            facecolor="white", edgecolor="none")
print(f"saved: {OUT}")
