import argparse
from pathlib import Path


EAT_F1 = 0.860
EAT_ECE = 1.03


def style() -> str:
    return """<style>
      .bg{fill:#f7f5ef}.panel{fill:#efede7}.ink{fill:#272b31}.muted{fill:#6d7480}.line{stroke:#bab5aa}.accent{fill:#c25a35}.accent2{fill:#7867a4}.white{fill:#fff}.title{font:700 38px ui-sans-serif,system-ui,sans-serif}.subtitle{font:20px ui-sans-serif,system-ui,sans-serif}.heading{font:700 25px ui-sans-serif,system-ui,sans-serif}.label{font:21px ui-sans-serif,system-ui,sans-serif}.small{font:18px ui-sans-serif,system-ui,sans-serif}.metric{font:700 64px ui-monospace,SFMono-Regular,monospace}.formula{font:600 24px ui-monospace,SFMono-Regular,monospace}
      @media(prefers-color-scheme:dark){.bg{fill:#1d1f21}.panel{fill:#282a2d}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.line{stroke:#66625c}.accent{fill:#e07a56}.accent2{fill:#a99add}}
    </style>"""


def write(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    clean = "\n".join(line.rstrip() for line in body.strip().splitlines())
    path.write_text(clean + "\n", encoding="utf-8")


def result_svg(path: Path) -> None:
    write(
        path,
        f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">E-AT results on balanced four-class ISIC</title>
  <desc id="desc">E-AT reached macro F1 {EAT_F1:.3f} and minimum expected calibration error {EAT_ECE:.2f} percent at separate checkpoints.</desc>
  {style()}
  <rect class="bg" width="1600" height="900" rx="24"/>
  <text class="title ink" x="82" y="72">E-AT on medical-image classification</text>
  <text class="subtitle muted" x="82" y="108">Balanced 4-class ISIC · ConvNeXtV2-Tiny · 384 px</text>

  <rect class="panel" x="82" y="158" width="698" height="560" rx="22"/>
  <text class="heading ink" x="130" y="222">Classification checkpoint</text>
  <text class="metric accent" x="130" y="374">{EAT_F1:.3f}</text>
  <text class="label ink" x="134" y="418">macro-F1 ↑</text>
  <line class="line" x1="130" y1="468" x2="732" y2="468" stroke-width="2"/>
  <text class="small muted" x="130" y="518">How well the model separates</text>
  <text class="small muted" x="130" y="550">the four skin-lesion classes</text>
  <rect class="accent" x="130" y="602" width="264" height="58" rx="29"/>
  <text class="label white" x="262" y="639" text-anchor="middle">Best macro-F1</text>

  <rect class="panel" x="820" y="158" width="698" height="560" rx="22"/>
  <text class="heading ink" x="868" y="222">Calibration checkpoint</text>
  <text class="metric accent2" x="868" y="374">{EAT_ECE:.2f}%</text>
  <text class="label ink" x="872" y="418">minimum ECE ↓</text>
  <line class="line" x1="868" y1="468" x2="1470" y2="468" stroke-width="2"/>
  <text class="small muted" x="868" y="518">How closely reported confidence</text>
  <text class="small muted" x="868" y="550">matches observed correctness</text>
  <rect class="accent2" x="868" y="602" width="264" height="58" rx="29"/>
  <text class="label white" x="1000" y="639" text-anchor="middle">Minimum ECE</text>

  <rect class="panel" x="82" y="764" width="1436" height="78" rx="16"/>
  <text class="small ink" x="800" y="812" text-anchor="middle">F1 and ECE are selected from their respective best checkpoints rather than combined into one operating point.</text>
</svg>
""",
    )


def method_svg(path: Path) -> None:
    nodes = [
        (82, "1", "Clean prediction", "Estimate target-class confidence", "on the original image"),
        (452, "2", "Focal difficulty", "Give difficult samples", "more classification weight"),
        (822, "3", "Adaptive FGM", "Apply a bounded perturbation", "scaled by sample difficulty"),
        (1192, "4", "R-Drop update", "Align two stochastic predictions", "while optimizing class loss"),
    ]
    blocks = []
    for x, number, heading, first, second in nodes:
        blocks.append(
            f"""
  <rect class="panel" x="{x}" y="238" width="326" height="286" rx="20"/>
  <circle class="accent" cx="{x + 46}" cy="286" r="24"/>
  <text class="label white" x="{x + 46}" y="294" text-anchor="middle">{number}</text>
  <text class="heading ink" x="{x + 30}" y="354">{heading}</text>
  <text class="small muted" x="{x + 30}" y="406">{first}</text>
  <text class="small muted" x="{x + 30}" y="438">{second}</text>
"""
        )
    arrows = []
    for x in (420, 790, 1160):
        arrows.append(
            f'<path class="line" d="M{x} 380 H{x + 22}" stroke-width="4"/><path class="line" d="M{x + 14} 370 L{x + 24} 380 L{x + 14} 390" fill="none" stroke-width="4"/>'
        )
    write(
        path,
        f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">E-AT training objective</title>
  <desc id="desc">E-AT connects focal sample difficulty, adaptive FGM perturbation, and bidirectional R-Drop consistency in one medical-image training objective.</desc>
  {style()}
  <rect class="bg" width="1600" height="900" rx="24"/>
  <text class="title ink" x="82" y="72">How E-AT trains calibrated confidence</text>
  <text class="subtitle muted" x="82" y="108">Classification loss and prediction consistency are optimized together during training</text>
  {''.join(blocks)}
  {''.join(arrows)}
  <rect class="accent2" x="286" y="610" width="1028" height="120" rx="20" opacity=".18"/>
  <text class="formula ink" x="800" y="660" text-anchor="middle">L = Focal(y, p₁) + λ(d) · R-Drop(p₁, p₂)</text>
  <text class="small muted" x="800" y="700" text-anchor="middle">d controls both the hard-sample emphasis and bounded perturbation strength</text>
  <text class="small muted" x="82" y="816">Backbone: pretrained ConvNeXtV2-Tiny · Input: 384 px ISIC image · Evaluation: macro-F1 and ECE</text>
</svg>
""",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    result_svg(args.output_dir / "eat-isic-results.svg")
    method_svg(args.output_dir / "eat-method.svg")


if __name__ == "__main__":
    main()
