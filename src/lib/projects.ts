const projectOrder = [
  ["WarpQuant", "warpquant"],
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
  const text = [project.summary, ...project.bullets].join(" ");
  const isKorean = /[가-힣]/.test(text);
  const units = isKorean ? text.replace(/\s/g, "").length / 450 : text.trim().split(/\s+/).length / 200;
  const minutes = Math.max(1, Math.ceil(units));

  return isKorean ? `${minutes}분` : `${minutes} min`;
}

export function getProjects(content: any) {
  const positions = new Map(projectOrder.map(([title], index) => [title, index]));

  return content.projectGroups
    .flatMap((group: any) =>
      group.projects.map((project: any) => ({
        ...project,
        topic: group.title,
        slug: projectSlugs.get(project.title),
        publishedAt: /[가-힣]/.test(project.summary) ? "2026.08.16" : "Aug 16, 2026",
        readingTime: estimateReadingTime(project),
      })),
    )
    .filter((project: any) => project.slug)
    .sort(
      (a: any, b: any) =>
        (positions.get(a.title) ?? Number.MAX_SAFE_INTEGER) -
        (positions.get(b.title) ?? Number.MAX_SAFE_INTEGER),
    );
}
