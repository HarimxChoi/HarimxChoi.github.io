import argparse
import html
import json
import re
from pathlib import Path


LIGHT_STYLE = """
.bg{fill:#f7f6f2}.surface{fill:#ffffff}.soft{fill:#dfe9e6}.soft2{fill:#eef2ef}.ink{fill:#202827}.muted{fill:#566361}.faint{fill:#75817f}.line{stroke:#c7ceca}.accent{fill:#587776}.accent-line{stroke:#587776}.risk{fill:#c25a35}.risk-soft{fill:#f5e4dc}.title{font:650 36px ui-sans-serif,system-ui,sans-serif}.subtitle{font:20px ui-sans-serif,system-ui,sans-serif}.head{font:650 24px ui-sans-serif,system-ui,sans-serif}.body{font:19px ui-sans-serif,system-ui,sans-serif}.small{font:17px ui-sans-serif,system-ui,sans-serif}.mono{font:600 17px ui-monospace,SFMono-Regular,monospace}.stat{font:700 42px ui-monospace,SFMono-Regular,monospace}.arrow{fill:none;stroke:#587776;stroke-width:3}.dash{fill:none;stroke:#75817f;stroke-width:2;stroke-dasharray:7 7}
@media (prefers-color-scheme:dark){.bg{fill:#1b2423}.surface{fill:#222e2d}.soft{fill:#29423f}.soft2{fill:#293735}.ink{fill:#eef2ef}.muted{fill:#b7c3c0}.faint{fill:#93a29f}.line{stroke:#465754}.accent{fill:#8db0ab}.accent-line{stroke:#8db0ab}.risk{fill:#e07a56}.risk-soft{fill:#4a332c}.arrow{stroke:#8db0ab}.dash{stroke:#93a29f}}
"""


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def box(x: int, y: int, w: int, h: int, cls: str = "surface") -> str:
    return f'<rect class="{cls} line" x="{x}" y="{y}" width="{w}" height="{h}" rx="18" stroke-width="1.5"/>'


def line_text(x: int, y: int, value: str, cls: str = "body ink", anchor: str = "start") -> str:
    return f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{esc(value)}</text>'


def bullet_lines(x: int, y: int, lines: list[str], gap: int = 34) -> list[str]:
    out = []
    for index, value in enumerate(lines):
        yy = y + index * gap
        out.append(f'<circle class="accent" cx="{x}" cy="{yy - 6}" r="4"/>')
        out.append(line_text(x + 16, yy, value, "body ink"))
    return out


def chip(x: int, y: int, w: int, value: str) -> list[str]:
    return [
        f'<rect class="soft" x="{x}" y="{y}" width="{w}" height="42" rx="21"/>',
        line_text(x + w // 2, y + 27, value, "mono ink", "middle"),
    ]


def arrow(path: str, dashed: bool = False) -> str:
    cls = "dash" if dashed else "arrow"
    marker = "" if dashed else ' marker-end="url(#arrow)"'
    return f'<path class="{cls}" d="{path}"{marker}/>'


def svg_open(width: int, height: int, title: str, description: str) -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{esc(title)}</title>',
        f'<desc id="desc">{esc(description)}</desc>',
        f'<style>{LIGHT_STYLE}</style>',
        '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" class="accent"/></marker></defs>',
        f'<rect class="bg" width="{width}" height="{height}" rx="18"/>',
    ]


def generate_architecture(repo: Path, output: Path) -> None:
    package = json.loads((repo / "package.json").read_text(encoding="utf-8"))
    source = (repo / "src" / "index.ts").read_text(encoding="utf-8")
    tools = re.findall(r"server\.registerTool\('([^']+)'", source)
    expected = ["search", "scholar_search", "search_parallel", "extract", "search_extract", "health"]
    if tools != expected:
        raise ValueError(f"Unexpected MCP tool surface: {tools}")
    for name in ["agent.ts", "pool.ts", "extract.ts", "extract-pdf.ts", "searchApi.ts", "strategyHealing.ts", "telemetry.ts"]:
        if not (repo / "src" / name).is_file():
            raise FileNotFoundError(name)

    parts = svg_open(
        1440,
        1040,
        "Google Surf MCP architecture",
        "Six MCP tools route through browser or SearchApi providers, guarded extraction, parser recovery, cache, telemetry, and health controls.",
    )
    parts += [
        line_text(60, 62, "Google Surf MCP · search that survives real web failure modes", "title ink"),
        line_text(60, 94, f"v{package['version']} · browser-first, API-routable, extraction-aware", "subtitle muted"),
        box(60, 125, 1320, 125),
        line_text(88, 161, "MCP tool surface", "head ink"),
    ]
    widths = [132, 188, 200, 125, 180, 110]
    cursor = 88
    for name, width in zip(tools, widths):
        parts += chip(cursor, 184, width, name)
        cursor += width + 18

    parts += [
        box(60, 310, 360, 275),
        line_text(88, 353, "Routing + orchestration", "head ink"),
        *bullet_lines(88, 397, [
            "browser · searchapi · fallback",
            "single request or 2–10 query fan-out",
            "per-query fallback keeps successful rows",
            "structured, retryable error contracts",
        ]),
        box(470, 310, 440, 275, "soft"),
        line_text(498, 353, "Browser provider", "head ink"),
        *bullet_lines(498, 397, [
            "persistent Playwright profile",
            "sequential context + parallel worker pool",
            "Google Search + Scholar parsers",
            "normal → stealth → human CAPTCHA recovery",
        ]),
        box(960, 310, 420, 275, "soft2"),
        line_text(988, 353, "SearchApi provider", "head ink"),
        *bullet_lines(988, 397, [
            "Google Search + Scholar engines",
            "primary route or browser fallback",
            "cloud-compatible execution path",
            "fallback reason preserved in metadata",
        ]),
        box(60, 650, 360, 245),
        line_text(88, 693, "Operating controls", "head ink"),
        *bullet_lines(88, 737, [
            "rate limiter + unified TTL cache",
            "parser drift detection + strategy healing",
            "telemetry events + health snapshot",
            "pool reset and dead-worker recovery",
        ]),
        box(470, 650, 910, 245, "surface"),
        line_text(498, 693, "HTML + academic PDF extraction", "head ink"),
        f'<rect class="risk-soft" x="498" y="720" width="854" height="48" rx="12"/>',
        line_text(522, 751, "SSRF boundary: URL · DNS · every redirect · Playwright navigation", "body risk"),
        *bullet_lines(498, 804, [
            "HTML: metadata → Mozilla Readability → clean Markdown",
            "PDF: content type + magic bytes + citation/domain discovery → LiteParse",
            "metadata / abstract / full modes · untrusted content fenced",
        ], 31),
        box(60, 940, 1320, 68, "soft"),
        line_text(88, 982, "Output", "head ink"),
        line_text(188, 982, "content + provider + cache + parser strategy + quality + bounded error", "body ink"),
        arrow("M240 250 V310"),
        arrow("M420 438 H470"),
        arrow("M420 390 C470 275 1170 275 1170 310"),
        arrow("M690 585 V650"),
        arrow("M1170 585 V620 C1170 620 900 620 900 650"),
        arrow("M925 895 V940"),
        arrow("M240 585 V650", True),
        arrow("M240 895 V940", True),
    ]
    parts.append("</svg>")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def test_category(name: str) -> str:
    if re.match(r"^extract", name):
        return "Extraction & SSRF"
    if re.match(r"^(captcha|heal|strategyHealing|backoff|timeout|response|humanlike|navigate)", name):
        return "Recovery & healing"
    if re.match(r"^(browser|cache|pool|cascade|config|limiter|telemetry)", name):
        return "Runtime & state"
    return "Search & providers"


def generate_validation(repo: Path, report: Path, output: Path) -> None:
    data = json.loads(report.read_text(encoding="utf-8"))
    results = data["testResults"]
    total = int(data["numTotalTests"])
    passed = int(data["numPassedTests"])
    failed = int(data["numFailedTests"])
    if failed or passed != total:
        raise ValueError(f"Test run is not clean: {passed}/{total}")
    repo_files = sorted((repo / "test").glob("*.test.ts"))
    if len(results) != len(repo_files):
        raise ValueError("Vitest report does not cover every test file")

    groups: dict[str, dict[str, int]] = {}
    for result in results:
        name = Path(result["name"]).name
        category = test_category(name)
        groups.setdefault(category, {"files": 0, "tests": 0})
        groups[category]["files"] += 1
        groups[category]["tests"] += len(result["assertionResults"])

    package = json.loads((repo / "package.json").read_text(encoding="utf-8"))
    parts = svg_open(
        1200,
        820,
        "Google Surf MCP automated validation surface",
        f"Version {package['version']} passes {passed} of {total} automated behavior tests across {len(repo_files)} files.",
    )
    parts += [
        line_text(60, 62, "Validation surface, not a feature checklist", "title ink"),
        line_text(60, 94, "Current source exercised across routing, extraction, recovery, and runtime state", "subtitle muted"),
        box(60, 126, 1080, 130, "soft"),
        line_text(90, 183, f"{passed} / {total}", "stat ink"),
        line_text(90, 222, "automated behavior tests passed", "body muted"),
        line_text(430, 181, str(len(repo_files)), "stat ink"),
        line_text(430, 222, "test files", "body muted"),
        line_text(710, 181, f"v{package['version']}", "stat ink"),
        line_text(710, 222, "verified source version", "body muted"),
        f'<rect class="soft2" x="90" y="237" width="1020" height="8" rx="4"/>',
        f'<rect class="accent" x="90" y="237" width="1020" height="8" rx="4"/>',
    ]

    specs = [
        ("Search & providers", 60, 300, ["Google + Scholar parsing", "SearchApi mapping + fallback", "scoring, triage, partial drift"]),
        ("Extraction & SSRF", 620, 300, ["URL, DNS, redirect guards", "Playwright navigation guard", "HTML, PDF, malformed PDF"]),
        ("Recovery & healing", 60, 510, ["CAPTCHA state + recovery", "parser strategy validation", "backoff, timeout, error contracts"]),
        ("Runtime & state", 620, 510, ["pool deadlock + dead workers", "cache, cascade, limiter", "telemetry + health data"]),
    ]
    for title, x, y, details in specs:
        count = groups[title]
        parts += [
            box(x, y, 520, 178),
            line_text(x + 26, y + 40, title, "head ink"),
            line_text(x + 26, y + 82, str(count["tests"]), "stat ink"),
            line_text(x + 124, y + 79, f"tests · {count['files']} files", "body muted"),
            line_text(x + 26, y + 112, details[0], "small ink"),
            line_text(x + 26, y + 138, details[1], "small ink"),
            line_text(x + 26, y + 164, details[2], "small ink"),
        ]

    parts += [
        box(60, 728, 1080, 55, "soft2"),
        line_text(85, 763, "Measured here: behavior tests. No statement-coverage percentage is implied.", "body muted"),
        "</svg>",
    ]
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--test-report", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    generate_architecture(args.repo, args.output_dir / "google-surf-architecture.svg")
    generate_validation(args.repo, args.test_report, args.output_dir / "google-surf-validation.svg")


if __name__ == "__main__":
    main()
