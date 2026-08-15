import argparse
import html
import re
from pathlib import Path


def read_comparison(path: Path) -> dict[str, tuple[int, int]]:
    text = path.read_text(encoding="utf-8")
    rows: dict[str, tuple[int, int]] = {}
    patterns = {
        "exact": r"\| exact response \|\s*(\d+)\s*/\s*36\s*\|\s*(\d+)\s*/\s*36",
        "compiled": r"\| exact compiled actions \|\s*(\d+)\s*/\s*6\s*\|\s*(\d+)\s*/\s*6",
        "binding": r"\| binding reference \|\s*(\d+)\s*/\s*6\s*\|\s*(\d+)\s*/\s*6",
        "safety": r"\| safety decision \|\s*(\d+)\s*/\s*12\s*\|\s*(\d+)\s*/\s*12",
        "forbidden": r"\| forbidden execution \|\s*(\d+)\s*\|\s*(\d+)\s*\|",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if not match:
            raise ValueError(f"Could not recover {key} comparison from {path}")
        rows[key] = (int(match.group(1)), int(match.group(2)))
    expected = {
        "exact": (17, 36),
        "compiled": (0, 6),
        "binding": (1, 6),
        "safety": (1, 12),
        "forbidden": (6, 0),
    }
    if rows != expected:
        raise ValueError(f"Frozen comparison changed: {rows}")
    return rows


def verify_sources(root: Path) -> None:
    anchors = {
        root / "packages/browser-program/src/index.ts": [
            "export function compileProgramDraft",
            "export function validateProgram",
            "export function createTaskReceipt",
        ],
        root / "packages/agent-core/src/runner.ts": [
            "async propose(",
            "async execute(",
            "if (!approved)",
        ],
        root / "apps/desktop/src/main/decision-log-sqlite.ts": [
            "export class SqliteDecisionLog",
        ],
        root / "apps/desktop/src/main/bau-mcp-server.ts": [
            "const server = new BauMcpServer",
            "allowedVerbs:",
        ],
    }
    for path, tokens in anchors.items():
        text = path.read_text(encoding="utf-8")
        missing = [token for token in tokens if token not in text]
        if missing:
            raise ValueError(f"Architecture anchors missing from {path}: {missing}")


def style() -> str:
    return """<style>
      .bg{fill:#f7f5ef}.panel{fill:#efede7}.panel-blue{fill:#e5edf1}.panel-orange{fill:#f4e8df}.panel-green{fill:#e5eee8}.ink{fill:#272b31}.muted{fill:#6d7480}.line{stroke:#8d9298}.blue{fill:#547a95}.orange{fill:#c25a35}.green{fill:#4f8068}.red{fill:#a94b42}.white{fill:#f7f5ef}.title{font:600 34px ui-sans-serif,system-ui,sans-serif}.subtitle{font:19px ui-sans-serif,system-ui,sans-serif}.lane{font:600 16px ui-monospace,SFMono-Regular,monospace;letter-spacing:1.5px}.heading{font:600 23px ui-sans-serif,system-ui,sans-serif}.label{font:19px ui-sans-serif,system-ui,sans-serif}.small{font:16px ui-sans-serif,system-ui,sans-serif}.metric{font:600 28px ui-monospace,SFMono-Regular,monospace}.big{font:600 52px ui-monospace,SFMono-Regular,monospace}.mono{font:17px ui-monospace,SFMono-Regular,monospace}
      @media(prefers-color-scheme:dark){.bg{fill:#1d1f21}.panel{fill:#292b2e}.panel-blue{fill:#26343d}.panel-orange{fill:#3b302a}.panel-green{fill:#293832}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}.line{stroke:#72777d}.blue{fill:#79a5c1}.orange{fill:#e07a56}.green{fill:#79a889}.red{fill:#d0776d}.white{fill:#1d1f21}}
    </style>"""


def text_lines(parts: list[str], x: int, y: int, lines: list[str], css: str = "label ink", gap: int = 29) -> None:
    for index, line in enumerate(lines):
        parts.append(f'<text class="{css}" x="{x}" y="{y + index * gap}">{html.escape(line)}</text>')


def arrow(parts: list[str], x1: int, y1: int, x2: int, y2: int, dashed: bool = False) -> None:
    dash = ' stroke-dasharray="8 7"' if dashed else ""
    parts.append(
        f'<line class="line" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke-width="2.5" marker-end="url(#arrow)"{dash}/>'
    )


def architecture_svg(output: Path) -> None:
    width, height = 1600, 980
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Bau Browser execution safety architecture</title>',
        '<desc id="desc">A three-lane architecture showing trusted browser observation and scope, a bounded model draft compiled by the host, two-phase human approval and scoped execution through browser and MCP tools, followed by action receipts, postcondition verification, and a local decision log.</desc>',
        style(),
        '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="line" d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>',
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        '<text class="title ink" x="74" y="58">Execution stays outside the model</text>',
        '<text class="subtitle muted" x="74" y="90">Bau Browser turns a model suggestion into a scoped, approved, and receipt-backed action.</text>',
        '<text class="lane muted" x="74" y="137">OBSERVE + COMPILE</text>',
        '<text class="lane muted" x="74" y="440">PROPOSE + APPROVE + EXECUTE</text>',
        '<text class="lane muted" x="74" y="710">VERIFY + RECORD</text>',
    ]

    top = [(74, 165, 322, 214), (430, 165, 322, 214), (786, 165, 322, 214), (1142, 165, 384, 214)]
    top_classes = ["panel", "panel-blue", "panel-orange", "panel-green"]
    for (x, y, w, h), css in zip(top, top_classes):
        parts.append(f'<rect class="{css}" x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/>')
    text_lines(parts, 102, 205, ["01  Desktop browser"], "heading ink")
    text_lines(parts, 102, 250, ["DOM + accessibility tree", "Current page generation", "Protected browser chrome"], "label ink")
    text_lines(parts, 458, 205, ["02  Trusted scope"], "heading ink")
    text_lines(parts, 458, 250, ["TaskSpec + PageGraph", "Allowed origins + verbs", "Budget + session access"], "label ink")
    text_lines(parts, 814, 205, ["03  Bounded draft"], "heading ink")
    text_lines(parts, 814, 250, ["Target handle + verb", "Effect + binding ID", "Postcondition only"], "label ink")
    text_lines(parts, 1170, 205, ["04  Host compiler"], "heading ink")
    text_lines(parts, 1170, 250, ["Reconstructs arguments", "Checks origin · frame · role", "Rejects stale / unknown targets"], "label ink")
    for index in range(3):
        x1 = top[index][0] + top[index][2]
        x2 = top[index + 1][0]
        arrow(parts, x1 + 5, 272, x2 - 10, 272)

    middle = [(430, 468, 322, 178), (786, 468, 322, 178), (1142, 468, 384, 178)]
    middle_classes = ["panel", "panel-orange", "panel-blue"]
    for (x, y, w, h), css in zip(middle, middle_classes):
        parts.append(f'<rect class="{css}" x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/>')
    text_lines(parts, 458, 512, ["05  Propose"], "heading ink")
    text_lines(parts, 458, 554, ["Plan and draft are visible", "No write capability yet"], "label ink")
    text_lines(parts, 814, 512, ["06  Human approval"], "heading ink")
    text_lines(parts, 814, 554, ["Approve the task scope", "Kill switch remains available"], "label ink")
    text_lines(parts, 1170, 512, ["07  Scoped execution"], "heading ink")
    text_lines(parts, 1170, 554, ["Browser tools · MCP interfaces", "Grant and ActionScope enforced"], "label ink")
    arrow(parts, 1334, 384, 1334, 456)
    arrow(parts, 752, 557, 774, 557)
    arrow(parts, 1108, 557, 1130, 557)
    parts.append('<text class="small orange" x="80" y="526">TWO-PHASE HITL</text>')
    parts.append('<text class="small muted" x="80" y="558">propose</text>')
    parts.append('<text class="small muted" x="80" y="588">approve</text>')
    parts.append('<text class="small muted" x="80" y="618">execute</text>')
    arrow(parts, 174, 552, 404, 552, True)

    bottom = [(430, 736, 322, 146), (786, 736, 322, 146), (1142, 736, 384, 146)]
    bottom_classes = ["panel-blue", "panel-green", "panel"]
    for (x, y, w, h), css in zip(bottom, bottom_classes):
        parts.append(f'<rect class="{css}" x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/>')
    text_lines(parts, 458, 780, ["08  Action receipt"], "heading ink")
    text_lines(parts, 458, 821, ["Before / after page state", "Origin · effect · evidence"], "label ink")
    text_lines(parts, 814, 780, ["09  Task verification"], "heading ink")
    text_lines(parts, 814, 821, ["Postconditions + evidence", "Success only after verification"], "label ink")
    text_lines(parts, 1170, 780, ["10  Local DecisionLog"], "heading ink")
    text_lines(parts, 1170, 821, ["SQLite / JSONL event record", "Raw URLs can be redacted"], "label ink")
    parts.append('<path class="line" d="M 1334 654 C 1334 696, 591 684, 591 724" fill="none" stroke-width="2.5" marker-end="url(#arrow)"/>')
    arrow(parts, 752, 808, 774, 808)
    arrow(parts, 1108, 808, 1130, 808)
    parts.extend([
        '<text class="small muted" x="800" y="944" text-anchor="middle">Implemented components: two-phase AgentRunner · compiler, grants and receipts · browser-as-MCP · local DecisionLog.</text>',
        '</svg>',
    ])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts) + "\n", encoding="utf-8")


def result_svg(output: Path, rows: dict[str, tuple[int, int]]) -> None:
    width, height = 1500, 900
    base_exact, adapter_exact = rows["exact"]
    base_forbidden, adapter_forbidden = rows["forbidden"]
    chart_left, chart_right = 104, 694
    bar_width = chart_right - chart_left
    exact_scale = lambda value: bar_width * value / 36
    forbidden_scale = lambda value: 440 * value / 6
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Qwen3.5-4B bound-draft synthetic preflight</title>',
        '<desc id="desc">Across 36 origin-disjoint synthetic cases, exact responses increased from 17 to 36 while forbidden executions decreased from 6 to 0. This is a synthetic preflight, not an official Online-Mind2Web or live browser benchmark.</desc>',
        style(),
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
        '<text class="title ink" x="74" y="58">A 4B model learned the bounded browser-draft contract</text>',
        '<text class="subtitle muted" x="74" y="90">Qwen3.5-4B base vs bound-draft adapter · 36 held-out origin-disjoint synthetic cases</text>',
        '<text class="heading ink" x="84" y="158">Exact response</text>',
        '<text class="small muted" x="84" y="187">Frozen decision, targets, bindings and postconditions · higher is better</text>',
        '<rect class="panel" x="84" y="216" width="650" height="330" rx="14"/>',
        '<text class="label ink" x="104" y="273">Base</text>',
        '<rect class="line" x="104" y="296" width="590" height="38" rx="6" opacity=".18"/>',
        f'<rect class="blue" x="104" y="296" width="{exact_scale(base_exact):.1f}" height="38" rx="6"/>',
        f'<text class="metric ink" x="{104 + exact_scale(base_exact) + 14:.1f}" y="326">{base_exact}/36</text>',
        '<text class="label ink" x="104" y="399">Bound-draft adapter</text>',
        '<rect class="line" x="104" y="422" width="590" height="38" rx="6" opacity=".18"/>',
        f'<rect class="green" x="104" y="422" width="{exact_scale(adapter_exact):.1f}" height="38" rx="6"/>',
        f'<text class="metric ink" x="682" y="452" text-anchor="end">{adapter_exact}/36</text>',
        f'<text class="big green" x="104" y="517">{adapter_exact / 36 * 100:.0f}%</text>',
        '<text class="label ink" x="226" y="515">exact on the frozen contract</text>',
        '<text class="heading ink" x="798" y="158">Forbidden execution</text>',
        '<text class="small muted" x="798" y="187">Unsafe execute decisions · lower is better</text>',
        '<rect class="panel-orange" x="778" y="216" width="638" height="330" rx="14"/>',
        '<text class="label ink" x="810" y="273">Base</text>',
        '<rect class="line" x="810" y="296" width="440" height="38" rx="6" opacity=".18"/>',
        f'<rect class="red" x="810" y="296" width="{forbidden_scale(base_forbidden):.1f}" height="38" rx="6"/>',
        f'<text class="metric ink" x="1270" y="326">{base_forbidden}</text>',
        '<text class="label ink" x="810" y="399">Bound-draft adapter</text>',
        '<rect class="line" x="810" y="422" width="440" height="38" rx="6" opacity=".18"/>',
        '<circle class="green" cx="810" cy="441" r="10"/>',
        f'<text class="metric ink" x="1270" y="452">{adapter_forbidden}</text>',
        '<text class="big green" x="810" y="517">6 → 0</text>',
        '<text class="label ink" x="1018" y="515">forbidden executions</text>',
        '<text class="lane muted" x="84" y="610">WHAT THE ADAPTER RECOVERED</text>',
    ]
    metrics = [
        (84, "Compiled actions", rows["compiled"], 6),
        (540, "Trusted binding", rows["binding"], 6),
        (996, "Safety decision", rows["safety"], 12),
    ]
    for x, label, values, denominator in metrics:
        base, adapter = values
        parts.extend([
            f'<rect class="panel" x="{x}" y="638" width="420" height="138" rx="14"/>',
            f'<text class="label ink" x="{x + 26}" y="680">{html.escape(label)}</text>',
            f'<text class="metric muted" x="{x + 26}" y="731">{base}/{denominator}</text>',
            f'<text class="metric ink" x="{x + 155}" y="731">→</text>',
            f'<text class="metric green" x="{x + 215}" y="731">{adapter}/{denominator}</text>',
        ])
    parts.extend([
        '<rect class="panel-orange" x="84" y="810" width="1332" height="52" rx="10"/>',
        '<text class="small ink" x="750" y="843" text-anchor="middle">Origin-disjoint synthetic precision preflight · not Online-Mind2Web · not live browser performance · no Q3 or TurboQuant claim</text>',
        '</svg>',
    ])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    source_root = args.source_root.resolve()
    verify_sources(source_root)
    rows = read_comparison(source_root / "tools/train-bau-model/PROGRAM-BOUND-V4-RESULT.md")
    architecture_svg(args.output_dir / "bau-execution-architecture.svg")
    result_svg(args.output_dir / "bau-bound-draft-preflight.svg", rows)
    print(
        f"exact={rows['exact'][0]}/36->{rows['exact'][1]}/36; "
        f"forbidden={rows['forbidden'][0]}->{rows['forbidden'][1]}; "
        f"output={args.output_dir.resolve()}"
    )


if __name__ == "__main__":
    main()
