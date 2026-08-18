from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

CARDS = {
    "procurement-nlp/nlp-card.svg": {
        "eyebrow": "KOREAN NLP · CPU SERVING",
        "title": "PROCUREMENT NLP",
        "subtitle": "NOTICE TITLE TO BIDABILITY AND WORK CATEGORY",
        "steps": [("TITLE", "Korean notice"), ("WEAK LABELS", "Domain ontology"), ("INT8 API", "Two CPU models")],
        "metric": "MACRO-F1 0.9639 · CATEGORY F1 0.90 · ~50 MS",
    },
    "google-surf-mcp/google-surf-card.svg": {
        "eyebrow": "AGENT SEARCH INFRASTRUCTURE",
        "title": "SEARCH · WEB · PDF",
        "subtitle": "ONE MCP FOR CURRENT, READABLE EVIDENCE",
        "steps": [("SEARCH", "Google + Scholar"), ("EXTRACT", "Web + academic PDF"), ("RECOVER", "Fallback + CAPTCHA")],
        "metric": "MCP TOPLIST · TOP 1%",
    },
    "monogram/monogram-card.svg": {
        "eyebrow": "PERSONAL KNOWLEDGE AUTOMATION",
        "title": "AUTOMATED PKM",
        "subtitle": "ONE SHARE ACTION BECOMES SEARCHABLE KNOWLEDGE",
        "steps": [("SHARE", "Link · message · file"), ("ORGANIZE", "Classify · verify · save"), ("SEARCH", "Dashboard · MCP")],
        "metric": "SHARE → ORGANIZE → SEARCH · 13 MCP TOOLS",
    },
    "bau-browser/bau-card.svg": {
        "eyebrow": "LOCAL-FIRST · USER-CONTROLLED",
        "title": "AGENTIC BROWSER",
        "subtitle": "PRIVACY, PERMISSION, AND ACTION CONTROL BUILT IN",
        "steps": [("PROPOSE", "Scoped action"), ("APPROVE", "User authority"), ("EXECUTE", "Receipt + log")],
        "metric": "LOCAL DATA · SCOPED ACTIONS · AUDITABLE RESULTS",
    },
    "langgraph-travel-agent/travel-card.svg": {
        "eyebrow": "AGENT WORKFLOW · CLIENT DELIVERY",
        "title": "TRAVEL AGENT",
        "subtitle": "NATURAL-LANGUAGE REQUEST TO BOOKABLE PACKAGES",
        "steps": [("REQUEST", "Budget · dates · preferences"), ("3 PACKAGES", "Budget · balanced · premium"), ("HANDOFF", "Review · CRM · message")],
        "metric": "LANGGRAPH · ASYNC SUPPLIERS · HUMAN REVIEW",
    },
}


def render(spec: dict[str, object]) -> str:
    boxes = []
    for index, (label, description) in enumerate(spec["steps"]):
        x = 80 + index * 500
        boxes.append(
            f'<rect class="surface line" x="{x}" y="360" width="420" height="220" rx="28"/>'
            f'<text class="step ink" x="{x + 36}" y="430">{label}</text>'
            f'<text class="body muted" x="{x + 36}" y="492">{description}</text>'
        )
        if index < 2:
            boxes.append(f'<path class="arrow" d="M{x + 430} 470 H{x + 478}" marker-end="url(#arrow)"/>')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc">
<title id="title">{spec["title"]}</title>
<desc id="desc">{spec["subtitle"]}</desc>
<style>
.bg{{fill:#f7f6f2}}.surface{{fill:#fff}}.soft{{fill:#dfe9e6}}.ink{{fill:#202827}}.muted{{fill:#566361}}.accent{{fill:#587776}}.line{{stroke:#c7ceca;stroke-width:3}}
.eyebrow{{font:700 30px ui-monospace,SFMono-Regular,monospace;letter-spacing:2px}}.title{{font:750 92px ui-sans-serif,system-ui,sans-serif;letter-spacing:-2px}}.subtitle{{font:600 34px ui-sans-serif,system-ui,sans-serif;letter-spacing:.5px}}
.step{{font:750 46px ui-sans-serif,system-ui,sans-serif}}.body{{font:30px ui-sans-serif,system-ui,sans-serif}}.metric{{font:700 40px ui-monospace,SFMono-Regular,monospace}}.arrow{{fill:none;stroke:#587776;stroke-width:7}}
@media (prefers-color-scheme:dark){{.bg{{fill:#18211f}}.surface{{fill:#22302d}}.soft{{fill:#29423f}}.ink{{fill:#eef2ef}}.muted{{fill:#b7c3c0}}.accent{{fill:#8db0ab}}.line{{stroke:#465754}}.arrow{{stroke:#8db0ab}}}}
</style>
<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto"><path d="M0,0 L0,8 L11,4 z" class="accent"/></marker></defs>
<rect class="bg" width="1600" height="1000" rx="30"/>
<text class="eyebrow accent" x="80" y="100">{spec["eyebrow"]}</text>
<text class="title ink" x="80" y="220">{spec["title"]}</text>
<text class="subtitle muted" x="80" y="292">{spec["subtitle"]}</text>
{''.join(boxes)}
<rect class="soft" x="80" y="690" width="1420" height="170" rx="30"/>
<text class="metric ink" x="790" y="792" text-anchor="middle">{spec["metric"]}</text>
</svg>
'''


def main() -> None:
    base = ROOT / "public" / "img" / "projects"
    for relative_path, spec in CARDS.items():
        path = base / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(render(spec), encoding="utf-8")


if __name__ == "__main__":
    main()
