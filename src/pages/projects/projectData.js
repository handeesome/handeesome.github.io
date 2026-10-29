import fm from "front-matter";

const presentation = {
  "score-karaoke-studio": { category: "Windows app", featured: 1, illustration: "score" },
  "learning-guide-live": { category: "Real-time collaboration", featured: 2, displayTitle: "Learning Guide Live & 见面" },
  "notion-widgets": { category: "Web widgets", featured: 3 },
  "tcg-card-manager": { category: "Collection tools" },
  "second-brain": { category: "Knowledge & reading" },
  "google-scholar": { category: "Browser extension" },
  "pnyl": { category: "Games & activities" },
  "hugo-book": { category: "Reading & listening" },
  "personal-website": { category: "Personal website" },
  "auto-pptx": { category: "Workflow tools" },
};

const modules = import.meta.glob("../../content/projects/*.md", {
  eager: true, query: "?raw", import: "default",
});

export const projects = Object.entries(modules).map(([path, raw]) => {
  const { attributes, body } = fm(raw);
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const image = body.match(/!\[([^\]]*)\]\(([^\s)]+)\)/);
  const date = attributes.date ? new Date(attributes.date) : null;
  const validDate = date && Number.isFinite(date.getTime()) ? date : null;
  const meta = presentation[slug] || { category: "Personal project" };
  const repository = body.match(/\[[^\]]*\]\((https:\/\/github\.com\/handeesome\/[^\s)]+)\)/)?.[1];
  const demo = body.match(/\[[^\]]*\]\((\/demos\/[^\s)]+)\)/)?.[1];
  const live = body.match(/\*\*Live site:\*\*\s*\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/)?.[1];
  const download = body.match(/\[[^\]]*\]\((https:\/\/github\.com\/handeesome\/score-karaoke-studio\/releases)\)/)?.[1];
  return {
    ...meta, slug, title: attributes.title || slug,
    displayTitle: meta.displayTitle || attributes.title || slug,
    description: attributes.description || "", tags: attributes.tags || [],
    dateTime: validDate?.getTime() || 0,
    isoDate: validDate?.toISOString().slice(0, 10),
    date: validDate?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) || "",
    year: validDate?.getFullYear(), body,
    image: image ? { src: image[2], alt: image[1], markdown: image[0] } : null,
    links: [
      demo && { label: "Try the demo", href: demo },
      live && { label: "Visit the site", href: live },
      download && { label: "Download for Windows", href: download },
      repository && { label: "View source", href: repository },
    ].filter(Boolean),
  };
}).sort((a, b) => b.dateTime - a.dateTime);

export function getProjectHeadings(body) {
  let fence = null;
  return body.split(/\r?\n/).flatMap((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return [];
    }
    const heading = !fence && line.match(/^##\s+(.+?)\s*#*$/);
    return heading ? [{ id: `section-${index + 1}`, text: heading[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "") }] : [];
  });
}
