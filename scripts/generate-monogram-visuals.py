import argparse
from html import escape
from pathlib import Path


WIDTH = 1500
HEIGHT = 900


STYLE = """
  .bg{fill:#f7f5ef}.panel{fill:#efede7}.panel2{fill:#e8e4dc}.ink{fill:#272b31}.muted{fill:#6d7480}
  .line{stroke:#aaa59b}.grid{stroke:#d8d4ca}.accent{fill:#c25a35}.accent-line{stroke:#c25a35}
  .blue{fill:#557a92}.blue-line{stroke:#557a92}.green{fill:#63836b}.green-line{stroke:#63836b}
  .purple{fill:#7867a4}.purple-line{stroke:#7867a4}.arrow-fill{fill:#aaa59b}
  .title{font:600 36px ui-sans-serif,system-ui,sans-serif}.subtitle{font:20px ui-sans-serif,system-ui,sans-serif}
  .heading{font:600 24px ui-sans-serif,system-ui,sans-serif}.label{font:20px ui-sans-serif,system-ui,sans-serif}
  .small{font:17px ui-sans-serif,system-ui,sans-serif}.tiny{font:15px ui-sans-serif,system-ui,sans-serif}
  .metric{font:600 25px ui-monospace,SFMono-Regular,monospace}.mono{font:17px ui-monospace,SFMono-Regular,monospace}
  @media(prefers-color-scheme:dark){
    .bg{fill:#1d1f21}.panel{fill:#282a2d}.panel2{fill:#313338}.ink{fill:#f1eee7}.muted{fill:#b0aaa0}
    .line{stroke:#6b6d71}.grid{stroke:#3b3d40}.accent{fill:#e07a56}.accent-line{stroke:#e07a56}
    .blue{fill:#72a3be}.blue-line{stroke:#72a3be}.green{fill:#83aa8b}.green-line{stroke:#83aa8b}
    .purple{fill:#a99add}.purple-line{stroke:#a99add}.arrow-fill{fill:#6b6d71}
  }
"""


def start_svg(title: str, description: str) -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{escape(title)}</title>',
        f'<desc id="desc">{escape(description)}</desc>',
        f"<style>{STYLE}</style>",
        '<defs><marker id="arrow" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path class="arrow-fill" d="M0,0 L10,5.5 L0,11 Z"/></marker></defs>',
        f'<rect class="bg" width="{WIDTH}" height="{HEIGHT}" rx="18"/>',
    ]


def rounded_box(x: int, y: int, w: int, h: int, cls: str = "panel", radius: int = 14) -> str:
    return f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}"/>'


def line(x1: int, y1: int, x2: int, y2: int, cls: str = "line", width: int = 3, arrow: bool = False) -> str:
    marker = ' marker-end="url(#arrow)"' if arrow else ""
    return f'<line class="{cls}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke-width="{width}"{marker}/>'


def label(x: int, y: int, value: str, cls: str = "label ink", anchor: str = "start") -> str:
    return f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{escape(value)}</text>'


def pill(x: int, y: int, w: int, value: str, color: str) -> list[str]:
    return [
        f'<rect class="{color}" x="{x}" y="{y}" width="{w}" height="34" rx="17" opacity=".13"/>',
        f'<circle class="{color}" cx="{x + 17}" cy="{y + 17}" r="5"/>',
        label(x + 31, y + 23, value, "tiny ink"),
    ]


def generate_architecture(output: Path) -> None:
    parts = start_svg(
        "Monogram capture and retrieval architecture",
        "Telegram, MCP, and document inputs pass through a verified five-stage pipeline into an atomic Git-backed vault, then serve local hybrid retrieval, scheduled briefs, and a client-decrypted dashboard.",
    )
    parts.extend(
        [
            label(72, 58, "From a saved message to durable, searchable memory", "title ink"),
            label(72, 91, "One capture path · verified routing · one Git commit across every affected file", "subtitle muted"),
            label(72, 142, "CAPTURE", "small muted"),
        ]
    )

    inputs = [
        (72, "Telegram", "saved messages + files", "accent"),
        (292, "MCP clients", "read tools + approved writes", "blue"),
        (512, "URL / document", "web · PDF · office · HWP", "green"),
    ]
    for x, heading, sub, color in inputs:
        parts.extend(
            [
                rounded_box(x, 160, 196, 84),
                f'<circle class="{color}" cx="{x + 24}" cy="188" r="7"/>',
                label(x + 42, 194, heading, "heading ink"),
                label(x + 20, 225, sub, "tiny muted"),
            ]
        )

    parts.extend(
        [
            line(738, 202, 802, 202, arrow=True),
            rounded_box(808, 148, 620, 108, "panel2"),
            label(836, 180, "Safety before inference", "heading ink"),
            *pill(836, 194, 176, "credential gate", "accent"),
            *pill(1024, 194, 172, "secret redaction", "blue"),
            *pill(1208, 194, 192, "approval on writes", "green"),
            label(72, 300, "FIVE-STAGE PIPELINE", "small muted"),
        ]
    )

    stages = [
        (72, "1", "Orchestrator", "choose operation"),
        (336, "2", "Classifier", "route + tags"),
        (600, "3", "Extractor", "structured fields"),
        (864, "4", "Verifier", "contradiction gate"),
        (1128, "5", "Writer", "deterministic files"),
    ]
    for index, (x, number, heading, sub) in enumerate(stages):
        parts.extend(
            [
                rounded_box(x, 320, 228, 116),
                f'<circle class="{"accent" if index == 3 else "blue" if index < 3 else "green"}" cx="{x + 28}" cy="350" r="14" opacity=".18"/>',
                label(x + 28, 357, number, "metric ink", "middle"),
                label(x + 52, 357, heading, "heading ink"),
                label(x + 28, 397, sub, "small muted"),
                label(x + 28, 420, "model stage" if index < 4 else "pure Python", "tiny muted"),
            ]
        )
        if index < len(stages) - 1:
            parts.append(line(x + 228, 378, x + 258, 378, arrow=True))

    parts.extend(
        [
            line(1242, 436, 1242, 483, arrow=True),
            rounded_box(830, 490, 598, 150, "panel2"),
            label(858, 526, "Git-backed vault", "heading ink"),
            label(858, 556, "Markdown + YAML · history in commits · recoverable state", "small muted"),
            *pill(858, 578, 178, "project + wiki", "blue"),
            *pill(1048, 578, 164, "daily + life", "green"),
            *pill(1224, 578, 176, "index shards", "purple"),
            label(72, 490, "ATOMIC WRITE", "small muted"),
            rounded_box(72, 508, 690, 132),
            label(102, 544, "One Git Tree commit", "heading ink"),
            label(102, 576, "All affected files land together, or the previous SHA remains current.", "small muted"),
            label(102, 608, "Concurrent ref updates retry from a fresh parent commit.", "small muted"),
            line(762, 574, 818, 574, arrow=True),
            label(72, 696, "USE", "small muted"),
        ]
    )

    outputs = [
        (72, 266, "Hybrid retrieval", "EmbeddingGemma + BM25/RRF", "accent"),
        (362, 266, "Encrypted dashboard", "AES-GCM · decrypt in browser", "blue"),
        (652, 266, "Morning / weekly", "briefs, board, lifecycle jobs", "green"),
        (942, 486, "MCP access", "semantic + graph + vault tools", "purple"),
    ]
    for x, w, heading, sub, color in outputs:
        parts.extend(
            [
                rounded_box(x, 716, w, 108),
                f'<rect class="{color}" x="{x}" y="716" width="7" height="108" rx="4"/>',
                label(x + 26, 755, heading, "heading ink"),
                label(x + 26, 790, sub, "small muted"),
            ]
        )
    parts.extend(
        [
            line(1128, 640, 1128, 704, arrow=True),
            label(72, 866, "Git-backed state, local retrieval, and client-side decryption keep private knowledge inspectable and portable.", "small muted"),
            "</svg>",
        ]
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def rank_lane(parts: list[str], x: int, y: int, title: str, color: str, order: list[str]) -> None:
    parts.extend([rounded_box(x, y, 276, 244), label(x + 24, y + 38, title, "heading ink")])
    for index, item in enumerate(order, start=1):
        top = y + 57 + (index - 1) * 52
        parts.extend(
            [
                f'<circle class="{color}" cx="{x + 30}" cy="{top + 18}" r="13" opacity=".18"/>',
                label(x + 30, top + 24, str(index), "mono ink", "middle"),
                rounded_box(x + 54, top, 194, 36, "panel2", 8),
                label(x + 70, top + 24, item, "mono ink"),
            ]
        )


def generate_retrieval(output: Path) -> None:
    parts = start_svg(
        "Monogram hybrid retrieval",
        "Monogram creates local EmbeddingGemma vectors, stores symmetric int8 embeddings in Git-backed area-and-month JSONL shards, and combines semantic dot-product ranking with BM25 via reciprocal rank fusion.",
    )
    parts.extend(
        [
            label(72, 58, "Hybrid retrieval without a vector database", "title ink"),
            label(72, 91, "EmbeddingGemma ONNX + int8 JSONL shards + BM25/RRF · no FAISS or hosted vector service", "subtitle muted"),
            rounded_box(72, 120, 300, 96),
            label(100, 152, "256 dims", "metric accent"),
            label(100, 184, "default MRL slice", "small muted"),
            rounded_box(388, 120, 300, 96),
            label(416, 152, "INT8", "metric blue"),
            label(416, 184, "symmetric [-127, 127]", "small muted"),
            rounded_box(704, 120, 300, 96),
            label(732, 152, "4x smaller", "metric green"),
            label(732, 184, "raw vector vs float32", "small muted"),
            rounded_box(1020, 120, 408, 96),
            label(1048, 152, "Area × month", "metric purple"),
            label(1048, 184, "self-routing, Git-versioned shards", "small muted"),
            label(72, 264, "INDEX BUILD", "small muted"),
        ]
    )

    build_steps = [
        (72, 210, "Markdown vault", "wiki · projects · life · daily"),
        (306, 226, "Chunk + route", "H2 split · area/month key"),
        (556, 266, "EmbeddingGemma", "300M · ONNX CPU · 768→256"),
        (846, 230, "Normalize + INT8", "L2 · base64 payload"),
        (1092, 336, "JSONL shards", "manifest + changed shards only"),
    ]
    for index, (x, w, heading, sub) in enumerate(build_steps):
        parts.extend(
            [
                rounded_box(x, 282, w, 110, "panel" if index % 2 == 0 else "panel2"),
                label(x + 22, 323, heading, "heading ink"),
                label(x + 22, 359, sub, "small muted"),
            ]
        )
        if index < len(build_steps) - 1:
            parts.append(line(x + w, 337, build_steps[index + 1][0] - 12, 337, arrow=True))

    parts.extend(
        [
            label(72, 448, "QUERY", "small muted"),
            rounded_box(72, 468, 276, 86, "panel2"),
            label(98, 503, "Natural-language query", "heading ink"),
            label(98, 532, "optional area filter", "small muted"),
            line(348, 511, 380, 511, arrow=True),
            rounded_box(392, 468, 250, 86),
            label(418, 503, "Embed once", "heading ink"),
            label(418, 532, "same prompt + INT8 path", "small muted"),
            line(642, 511, 662, 511, arrow=True),
        ]
    )

    rank_lane(parts, 676, 446, "Semantic lane", "accent", ["A · concept match", "C · nearby context", "B · related note"])
    rank_lane(parts, 972, 446, "Lexical lane", "blue", ["B · exact terms", "A · partial terms", "D · keyword hit"])

    parts.extend(
        [
            label(814, 713, "NumPy int16 matmul", "tiny muted", "middle"),
            label(814, 736, "pure-Python dot fallback", "tiny muted", "middle"),
            label(1110, 713, "BM25 k1=1.5 · b=0.75", "tiny muted", "middle"),
            line(814, 690, 814, 762, arrow=True),
            line(1110, 690, 1110, 762, arrow=True),
            rounded_box(690, 774, 350, 82, "panel2"),
            label(720, 808, "Reciprocal Rank Fusion", "heading ink"),
            label(720, 838, "fusion without score calibration", "small muted"),
            line(1040, 815, 1052, 815, arrow=True),
            rounded_box(1064, 774, 238, 82, "panel"),
            label(1086, 808, "Optional reranker", "heading ink"),
            label(1086, 838, "ONNX cross-encoder", "small muted"),
            line(1302, 815, 1314, 815, arrow=True),
            rounded_box(1326, 742, 102, 114),
            label(1377, 780, "Top k", "heading ink", "middle"),
            label(1377, 811, "path", "mono muted", "middle"),
            label(1377, 835, "heading", "mono muted", "middle"),
            label(1377, 859, "excerpt", "mono muted", "middle"),
            label(72, 604, "FALLBACK", "small muted"),
            rounded_box(72, 626, 520, 110),
            label(100, 664, "No service dependency", "heading ink"),
            label(100, 696, "NumPy unavailable → pure-Python dot scan", "small muted"),
            label(100, 722, "Reranker unavailable → keep RRF order", "small muted"),
            label(72, 866, "Ranking cards illustrate the fusion path; they are not benchmark results. Raw-size comparison is derived from 256 × 1-byte INT8 vs 256 × 4-byte float32.", "small muted"),
            "</svg>",
        ]
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(parts), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=Path("public/img/projects/monogram"))
    args = parser.parse_args()
    generate_architecture(args.output_dir / "monogram-architecture.svg")
    generate_retrieval(args.output_dir / "monogram-hybrid-retrieval.svg")


if __name__ == "__main__":
    main()
