import { getProjectDetail } from "../data/projectDetails";

const projectOrder = [
  ["WarpQuant", "warpquant"],
  ["Uncertainty-Aware Bid ML", "probabilistic-bid-mlops"],
  ["Document AI OCR", "document-ai-ocr"],
  ["Procurement NLP", "procurement-nlp"],
  ["R2CCP Bid Prediction", "r2ccp-bid-prediction"],
  ["google-surf-mcp", "google-surf-mcp"],
  ["Monogram", "monogram"],
  ["Bau Browser", "bau-browser"],
  ["Vargo", "vargo"],
  ["EMH Agent", "emh-agent"],
  ["MyShot", "myshot"],
  ["EAT", "eat"],
  ["WSSS", "wsss"],
  ["LangGraph Travel Agent", "langgraph-travel-agent"],
] as const;

const projectSlugs = new Map<string, string>(projectOrder);

function estimateReadingTime(project: any) {
  const text = [project.summary, ...project.bullets, JSON.stringify(project.detail ?? {})].join(" ");
  const isKorean = /[가-힣]/.test(text);
  const units = isKorean ? text.replace(/\s/g, "").length / 450 : text.trim().split(/\s+/).length / 200;
  const minutes = Math.max(1, Math.ceil(units));

  return isKorean ? `${minutes}분` : `${minutes} min`;
}

export function getProjects(content: any) {
  const positions = new Map(projectOrder.map(([title], index) => [title, index]));

  return content.projectGroups
    .flatMap((group: any) =>
      group.projects.map((project: any) => {
        const slug = projectSlugs.get(project.title);
        const lang = /[가-힣]/.test(project.summary) ? "ko" : "en";
        const detail = getProjectDetail(slug, lang);
        const cardImage =
          slug === "warpquant"
            ? {
                src: "/img/projects/warpquant/warpquant-social-cover.png",
                alt:
                  lang === "ko"
                    ? "WarpQuant INT3 LLM 양자화 전체 구조"
                    : "WarpQuant INT3 LLM quantization overview",
              }
            : detail?.figures?.[0];
        const enrichedProject = {
          ...project,
          topic: group.title,
          slug,
          detail,
          image: cardImage?.src ?? project.image,
          imageAlt: cardImage?.alt ?? project.imageAlt,
          publishedAt: lang === "ko" ? "2026.08.16" : "Aug 16, 2026",
        };

        return {
          ...enrichedProject,
          readingTime: estimateReadingTime(enrichedProject),
        };
      }),
    )
    .filter((project: any) => project.slug)
    .sort(
      (a: any, b: any) =>
        (positions.get(a.title) ?? Number.MAX_SAFE_INTEGER) -
        (positions.get(b.title) ?? Number.MAX_SAFE_INTEGER),
    );
}
