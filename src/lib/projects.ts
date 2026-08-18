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

const cardVisuals: Record<string, { src: string; alt: { en: string; ko: string } }> = {
  "procurement-nlp": {
    src: "/img/projects/procurement-nlp/nlp-card.svg",
    alt: {
      en: "Procurement NLP flow from a notice title through weak labels to an INT8 CPU API",
      ko: "공고명에서 weak label과 INT8 CPU API로 이어지는 Procurement NLP 흐름",
    },
  },
  "google-surf-mcp": {
    src: "/img/projects/google-surf-mcp/google-surf-card.svg",
    alt: {
      en: "One MCP connecting search, web extraction, academic PDF parsing, and recovery",
      ko: "검색, 웹 본문, 학술 PDF parsing과 복구를 하나로 연결한 MCP",
    },
  },
  monogram: {
    src: "/img/projects/monogram/monogram-card.svg",
    alt: {
      en: "Automated PKM flow from sharing through organization to search",
      ko: "공유에서 정리와 검색으로 이어지는 Automated PKM 흐름",
    },
  },
  "bau-browser": {
    src: "/img/projects/bau-browser/bau-card.svg",
    alt: {
      en: "Agentic Browser flow from scoped proposal through approval to an auditable result",
      ko: "범위가 정해진 제안에서 승인과 실행기록으로 이어지는 Agentic Browser",
    },
  },
  "langgraph-travel-agent": {
    src: "/img/projects/langgraph-travel-agent/travel-card.svg",
    alt: {
      en: "Travel Agent flow from a natural-language request to three packages and CRM handoff",
      ko: "자연어 요청에서 세 개 여행상품과 CRM 연동으로 이어지는 Travel Agent",
    },
  },
  myshot: {
    src: "/img/projects/myshot/myshot-vision-tracking.png",
    alt: {
      en: "MyShot tracking a golfer, club, ball, pose skeleton, joint angles, and the ball path in one swing",
      ko: "한 번의 스윙에서 골퍼·클럽·공, pose skeleton, 관절각과 공의 이동 경로를 함께 추적하는 MyShot",
    },
  },
};

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
        const cardVisual = slug ? cardVisuals[slug] : undefined;
        const cardImage =
          cardVisual
            ? { src: cardVisual.src, alt: cardVisual.alt[lang] }
            : slug === "warpquant"
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
          topic: detail?.category ?? group.title,
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
