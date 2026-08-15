import argparse
from pathlib import Path


STYLE = """
  .bg{fill:#f7f5ef}.panel{fill:#efeee9;stroke:#d0d5d1}.card{fill:#fff;stroke:#c8ceca}
  .ink{fill:#202827}.muted{fill:#566361}.faint{fill:#75817f}.accent{fill:#587776}.accent-soft{fill:#dfe9e6;stroke:#8aa3a0}
  .orange{fill:#c25a35}.orange-soft{fill:#f4e4dc;stroke:#d19a83}.blue{fill:#557a92}.blue-soft{fill:#e0e9ee;stroke:#8ca5b4}
  .line{stroke:#a9b3b0}.dash{stroke:#8aa3a0;stroke-dasharray:9 8}.strong{stroke:#587776}
  .title{font:600 38px ui-sans-serif,system-ui,sans-serif}.subtitle{font:20px ui-sans-serif,system-ui,sans-serif}
  .lane{font:600 15px ui-monospace,SFMono-Regular,monospace;letter-spacing:1.6px}.head{font:600 23px ui-sans-serif,system-ui,sans-serif}
  .body{font:18px ui-sans-serif,system-ui,sans-serif}.small{font:16px ui-sans-serif,system-ui,sans-serif}
  .mono{font:600 16px ui-monospace,SFMono-Regular,monospace}.metric{font:600 31px ui-monospace,SFMono-Regular,monospace}.badge-text{fill:#fff;font:600 14px ui-monospace,SFMono-Regular,monospace}
  @media(prefers-color-scheme:dark){
    .bg{fill:#1d2524}.panel{fill:#222e2d;stroke:#394947}.card{fill:#293735;stroke:#465956}
    .ink{fill:#eef2ef}.muted{fill:#b7c3c0}.faint{fill:#93a29f}.accent{fill:#8db0ab}.accent-soft{fill:#29423f;stroke:#638a87}
    .orange{fill:#e07a56}.orange-soft{fill:#4b3028;stroke:#a85f45}.blue{fill:#72a3be}.blue-soft{fill:#293e49;stroke:#527d95}
    .line{stroke:#5c706d}.dash{stroke:#638a87}.strong{stroke:#8db0ab}.badge-text{fill:#1d2524}
  }
"""


def text_block(x, y, lines, css="body ink", line_height=27, anchor="start"):
    spans = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else line_height
        spans.append(f'<tspan x="{x}" dy="{dy}" text-anchor="{anchor}">{line}</tspan>')
    return f'<text class="{css}" x="{x}" y="{y}">' + "".join(spans) + "</text>"


def box(x, y, width, height, title, lines, css="card", kicker=None):
    parts = [f'<rect class="{css}" x="{x}" y="{y}" width="{width}" height="{height}" rx="16"/>']
    title_y = y + 42
    if kicker:
        parts.append(f'<text class="lane accent" x="{x + 24}" y="{y + 27}">{kicker}</text>')
        title_y = y + 60
    parts.append(f'<text class="head ink" x="{x + 24}" y="{title_y}">{title}</text>')
    if lines:
        parts.append(text_block(x + 24, title_y + 34, lines, "small muted", 24))
    return "\n".join(parts)


def arrow(x1, y1, x2, y2, css="line", dashed=False):
    marker = "url(#arrow-accent)" if css in {"strong", "dash"} else "url(#arrow)"
    cls = "dash" if dashed else css
    return f'<path class="{cls}" d="M{x1} {y1} L{x2} {y2}" fill="none" stroke-width="2.5" marker-end="{marker}"/>'


def validate_repo(repo: Path):
    checks = {
        repo / "backend/graph/builder.py": ["StateGraph", "InMemorySaver", "send_sms_notification", '"collecting_info": END', '"synthesizing": "synthesize_results"'],
        repo / "backend/graph/nodes.py": ["asyncio.gather", "generate_travel_packages", "send_to_hubspot.ainvoke"],
        repo / "backend/api/main.py": ["BackgroundTasks", "jobs = {}", "/chat/status/{task_id}", "/chat/customer-info"],
        repo / "backend/models/travel.py": ['Literal["Budget", "Balanced", "Premium"]', "selected_activities"],
    }
    missing = []
    for path, anchors in checks.items():
        if not path.exists():
            missing.append(str(path))
            continue
        source = path.read_text(encoding="utf-8")
        missing.extend(f"{path}: {anchor}" for anchor in anchors if anchor not in source)
    if missing:
        raise ValueError("Travel-agent source anchors changed:\n" + "\n".join(missing))
    nodes = (repo / "backend/graph/nodes.py").read_text(encoding="utf-8")
    if "send_sms_notification" in nodes:
        raise ValueError("Twilio is now present in the default graph nodes; update the architecture label")


def architecture_svg():
    width, height = 1600, 1060
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">LangGraph travel-agent architecture</title>',
        '<desc id="desc">The implemented default path accepts an asynchronous FastAPI request, pauses on the first turn for a customer-information form, resumes the same LangGraph thread, extracts a TravelPlan, searches flights, hotels, and activities concurrently, and synthesizes package recommendations.</desc>',
        f"<style>{STYLE}</style>",
        '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" class="faint"/></marker><marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" class="accent"/></marker></defs>',
        f'<rect class="bg" width="{width}" height="{height}" rx="20"/>',
        '<text class="title ink" x="60" y="58">Travel planning as a resumable, tool-using workflow</text>',
        '<text class="subtitle muted" x="60" y="91">Default implemented path · conditional LangGraph state · parallel external search · asynchronous delivery</text>',
        '<text class="lane accent" x="60" y="143">CONVERSATION &amp; API</text>',
        '<text class="lane accent" x="520" y="143">LANGGRAPH WORKFLOW</text>',
        '<text class="lane accent" x="1170" y="143">STATE &amp; INTEGRATIONS</text>',
        '<line class="line" x1="60" y1="159" x2="440" y2="159"/><line class="line" x1="520" y1="159" x2="1110" y2="159"/><line class="line" x1="1170" y1="159" x2="1540" y2="159"/>',
    ]

    parts.extend([
        arrow(440, 248, 520, 248, "strong"),
        arrow(815, 330, 815, 378, "strong"),
        arrow(440, 525, 520, 525, "strong"),
        arrow(815, 550, 815, 598, "strong"),
        arrow(1110, 706, 1170, 706, "strong"),
        arrow(815, 790, 815, 838, "strong"),
        arrow(520, 918, 440, 918, "strong"),
        arrow(1110, 918, 1170, 918, "strong"),
        arrow(1170, 240, 1110, 240, "dash", True),
        '<path class="strong" d="M520 270 L482 270 L482 448 L440 448" fill="none" stroke-width="2.5" marker-end="url(#arrow-accent)"/>',
        '<text class="small faint" x="494" y="361" transform="rotate(-90 494 361)">collecting_info</text>',
        '<text class="small faint" x="828" y="359">continuation</text>',
        '<text class="small faint" x="460" y="516">resume</text>',
    ])

    parts.extend([
        box(60, 185, 380, 125, "Async chat request", ["POST /chat returns a task_id", "GET /chat/status polls the result"], kicker="01  FASTAPI"),
        box(520, 185, 590, 145, "call_model_and_tools", ["First turn with no customer_info → collecting_info → END", "Continuation → analyze request, run tools, set synthesizing"], kicker="02  ENTRY NODE"),
        box(1170, 185, 370, 130, "Thread and task state", ["InMemorySaver checkpoints each thread", "In-memory job store tracks task status"], kicker="STATE"),
        box(60, 378, 380, 147, "Customer-information handoff", ["form_to_display pauses the first turn", "POST /chat/customer-info, then resume", "Same thread_id + is_continuation=true"], "accent-soft", "03  HUMAN IN THE LOOP"),
        box(520, 378, 590, 172, "Structured TravelPlan", ["LLM extracts intent, route, dates, duration and travelers", "Validated Pydantic schema; form budget is injected", "No applicable search → complete → END"], kicker="04  ANALYZE"),
        box(520, 598, 590, 192, "Parallel search coordinator", ["asyncio.gather runs applicable tools concurrently", "Flights · hotels · activities", "Tool failures are isolated and serialized as empty results"], kicker="05  EXECUTE"),
        box(1170, 590, 370, 232, "Live inventory providers", ["Amadeus: flights, hotels, activities", "Hotelbeds: optional hotel inventory", "Hotel providers also run concurrently", "Location conversion: airport ↔ city ↔ coordinates"], "blue-soft", "SEARCH APIS"),
        box(520, 838, 590, 152, "synthesize_results", ["Representative options → Budget / Balanced / Premium", "Final response highlights Balanced and completes the graph"], "orange-soft", "06  SYNTHESIZE"),
        box(60, 840, 380, 150, "Result returned to chat", ["Markdown recommendation arrives through", "the same asynchronous status endpoint"], kicker="07  DELIVER"),
        box(1170, 840, 370, 150, "Optional delivery integrations", ["HubSpot: called after synthesis", "when customer data exists", "Twilio: registered tool; not in the default node path"], kicker="OPTIONAL"),
        '<text class="small faint" x="60" y="1030">Source-grounded from backend/api/main.py, backend/graph/builder.py, backend/graph/nodes.py and backend/models/travel.py</text>',
    ])
    parts.append("</svg>")
    return "\n".join(parts)


def stacked_bar(x, y, width, values, total, colors):
    parts = []
    cursor = x
    for value, color in zip(values, colors):
        segment = width * value / total
        parts.append(f'<rect class="{color}" x="{cursor:.1f}" y="{y}" width="{segment:.1f}" height="18"/>')
        cursor += segment
    return "\n".join(parts)


def package_card(x, grade, name, total, flight, hotel, hotel_nights, activities, budget, recommended=False):
    width, y, height = 445, 292, 530
    hotel_total = hotel * hotel_nights
    difference = budget - total
    card_class = "orange-soft" if recommended else "card"
    badge_class = "orange" if recommended else "accent"
    parts = [f'<rect class="{card_class}" x="{x}" y="{y}" width="{width}" height="{height}" rx="18"/>']
    parts.append(f'<rect class="{badge_class}" x="{x + 24}" y="{y + 24}" width="{122 if not recommended else 214}" height="30" rx="15"/>')
    badge = f"{grade} · recommended" if recommended else grade
    parts.append(f'<text class="badge-text" x="{x + 38}" y="{y + 45}">{badge}</text>')
    parts.append(f'<text class="head ink" x="{x + 24}" y="{y + 94}">{name}</text>')
    parts.append(f'<text class="metric ink" x="{x + 24}" y="{y + 146}">${total:,.0f}</text>')
    variance = f"${abs(difference):,.0f} under budget" if difference >= 0 else f"${abs(difference):,.0f} over budget"
    parts.append(f'<text class="small {"accent" if difference >= 0 else "orange"}" x="{x + 24}" y="{y + 176}">{variance}</text>')
    rows = [
        ("FlightOption", f"Example Air · ${flight:,.0f}"),
        ("HotelOption", f"${hotel:,.0f} × {hotel_nights} nights · ${hotel_total:,.0f}"),
        ("ActivityOption", f"2 selected · ${activities:,.0f}"),
    ]
    row_y = y + 226
    for label, value in rows:
        parts.append(f'<text class="lane faint" x="{x + 24}" y="{row_y}">{label}</text>')
        parts.append(f'<text class="body ink" x="{x + 24}" y="{row_y + 30}">{value}</text>')
        parts.append(f'<line class="line" x1="{x + 24}" y1="{row_y + 51}" x2="{x + width - 24}" y2="{row_y + 51}"/>')
        row_y += 78
    parts.append(stacked_bar(x + 24, y + 475, width - 48, [flight, hotel_total, activities], total, ["blue", "accent", "orange"]))
    parts.append(f'<text class="small faint" x="{x + 24}" y="{y + 515}">flight</text>')
    parts.append(f'<text class="small faint" x="{x + 182}" y="{y + 515}">hotel</text>')
    parts.append(f'<text class="small faint" x="{x + 318}" y="{y + 515}">activities</text>')
    return "\n".join(parts)


def result_svg():
    width, height = 1600, 1020
    budget = 3600
    packages = [
        (60, "Budget", "Metro Saver", 1945, 940, 175, 5, 130, budget, False),
        (577, "Balanced", "Paris Weekender", 2736, 1180, 265, 5, 231, budget, True),
        (1095, "Premium", "Left Bank Comfort", 3655, 1550, 365, 5, 280, budget, False),
    ]
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">TravelPackage synthesis example</title>',
        '<desc id="desc">A synthetic, schema-grounded example compares Budget, Balanced, and Premium packages for a five-night Seoul-to-Paris request. Each package contains one flight, one hotel, and two activities; the Balanced tier is highlighted as recommended.</desc>',
        f"<style>{STYLE}</style>",
        f'<rect class="bg" width="{width}" height="{height}" rx="20"/>',
        '<text class="title ink" x="60" y="58">From one request to three comparable packages</text>',
        '<text class="subtitle muted" x="60" y="91">Synthetic schema example · illustrative prices, not live quotes or client data</text>',
        '<rect class="panel" x="60" y="130" width="1480" height="112" rx="16"/>',
        '<text class="lane accent" x="88" y="164">STRUCTURED TRAVELPLAN</text>',
        '<text class="head ink" x="88" y="207">SEL → PAR</text>',
        '<text class="body muted" x="310" y="207">5 nights</text>',
        '<text class="body muted" x="475" y="207">2 adults</text>',
        '<text class="body muted" x="645" y="207">ECONOMY</text>',
        '<text class="body muted" x="850" y="207">Budget $3,600</text>',
        '<text class="small faint" x="1510" y="207" text-anchor="end">full_plan</text>',
    ]
    for args in packages:
        parts.append(package_card(*args))
    parts.extend([
        '<circle class="blue" cx="70" cy="881" r="7"/><text class="small muted" x="88" y="887">flight</text>',
        '<circle class="accent" cx="170" cy="881" r="7"/><text class="small muted" x="188" y="887">hotel × nights</text>',
        '<circle class="orange" cx="354" cy="881" r="7"/><text class="small muted" x="372" y="887">activities</text>',
        '<rect class="panel" x="60" y="920" width="1480" height="66" rx="14"/>',
        '<text class="mono accent" x="88" y="961">TravelPackage = 1 FlightOption + 1 HotelOption + 0–2 ActivityOption</text>',
        '<text class="small faint" x="1510" y="961" text-anchor="end">total_cost = flight + hotel × nights + activities</text>',
        '</svg>',
    ])
    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser(description="Generate source-grounded LangGraph travel-agent visuals")
    parser.add_argument("--repo", type=Path, required=True, help="Path to the langgraph-travel-agent repository")
    parser.add_argument("--output-dir", type=Path, required=True, help="Directory for generated SVG assets")
    args = parser.parse_args()

    validate_repo(args.repo)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "travel-architecture.svg").write_text(architecture_svg(), encoding="utf-8")
    (args.output_dir / "travel-package-example.svg").write_text(result_svg(), encoding="utf-8")
    print(args.output_dir / "travel-architecture.svg")
    print(args.output_dir / "travel-package-example.svg")


if __name__ == "__main__":
    main()
