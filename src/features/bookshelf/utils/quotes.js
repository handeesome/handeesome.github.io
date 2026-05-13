export const QUOTE_COLOR_PALETTE = [
  { label: "Default", value: "" },
  { label: "Red", value: "#C00000" },
  { label: "Yellow", value: "#FFC000" },
  { label: "Pink", value: "#FCABD8" },
  { label: "Purple", value: "#CA97EA" },
  { label: "Blue", value: "#0D6EFD" },
  { label: "Green", value: "#198754" },
];

const ALLOWED_COLORS = new Set(
  QUOTE_COLOR_PALETTE.map((color) => color.value.toUpperCase()).filter(Boolean),
);
const RGB_TO_ALLOWED_COLOR = new Map(
  QUOTE_COLOR_PALETTE.filter((color) => color.value).map((color) => {
    const hex = color.value.slice(1);
    const rgb = [0, 2, 4]
      .map((start) => parseInt(hex.slice(start, start + 2), 16))
      .join(",");
    return [rgb, color.value.toUpperCase()];
  }),
);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeColor = (value = "") => {
  const color = value.trim().toUpperCase();
  if (!color) return "";

  const withHash = color.startsWith("#") ? color : `#${color}`;
  if (ALLOWED_COLORS.has(withHash)) return withHash;

  const rgb = color.match(/^RGB\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/);
  if (!rgb) return "";

  return RGB_TO_ALLOWED_COLOR.get(`${rgb[1]},${rgb[2]},${rgb[3]}`) || "";
};

const getTextFromHtml = (html) => {
  if (typeof window === "undefined" || !window.document) {
    return String(html || "").replace(/<[^>]*>/g, "").trim();
  }

  const el = window.document.createElement("div");
  el.innerHTML = html || "";
  return el.textContent?.trim() || "";
};

const cleanNode = (node, doc) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tagName = node.tagName.toLowerCase();
  const allowedInlineTags = new Set(["span", "strong", "b", "em", "i", "u"]);

  if (tagName === "br") {
    return doc.createElement("br");
  }

  const nextNode = allowedInlineTags.has(tagName)
    ? doc.createElement(tagName)
    : doc.createDocumentFragment();

  Array.from(node.childNodes).forEach((child) => {
    const cleanedChild = cleanNode(child, doc);
    if (cleanedChild) nextNode.appendChild(cleanedChild);
  });

  if (tagName === "span" && nextNode.nodeType === Node.ELEMENT_NODE) {
    const color = normalizeColor(node.style?.color || "");
    if (color) nextNode.style.color = color;
  }

  return nextNode;
};

const sanitizeInlineHtml = (html) => {
  if (typeof window === "undefined" || !window.document) {
    return escapeHtml(getTextFromHtml(html));
  }

  const doc = window.document;
  const source = doc.createElement("div");
  const target = doc.createElement("div");
  source.innerHTML = html || "";

  Array.from(source.childNodes).forEach((child) => {
    const cleanedChild = cleanNode(child, doc);
    if (cleanedChild) target.appendChild(cleanedChild);
  });

  return target.innerHTML.trim();
};

const splitQuoteSourceFromText = (text) => {
  const parts = String(text || "").split("--");
  if (parts.length < 2) {
    return { source: "", quoteText: String(text || "").trim() };
  }

  const source = parts.shift().trim();
  const quoteText = parts.join("--").trim();
  return source && quoteText
    ? { source, quoteText }
    : { source: "", quoteText: String(text || "").trim() };
};

const stripLeadingSourceHtml = (html) => {
  if (typeof window === "undefined" || !window.document) {
    return escapeHtml(splitQuoteSourceFromText(getTextFromHtml(html)).quoteText);
  }

  const doc = window.document;
  const wrapper = doc.createElement("div");
  wrapper.innerHTML = sanitizeInlineHtml(html);

  const walker = doc.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  let consumedSource = false;

  while (!consumedSource) {
    const textNode = walker.nextNode();
    if (!textNode) break;

    const delimiterIndex = textNode.nodeValue.indexOf("--");
    if (delimiterIndex >= 0) {
      textNode.nodeValue = textNode.nodeValue.slice(delimiterIndex + 2);
      consumedSource = true;
      break;
    }

    textNode.nodeValue = "";
  }

  return wrapper.innerHTML.trim();
};

export const getQuoteText = (quote) => {
  if (typeof quote === "string") return quote.trim();
  if (!quote || typeof quote !== "object") return "";
  if (typeof quote.text === "string") return quote.text.trim();
  if (typeof quote.content === "string") return getTextFromHtml(quote.content);
  return "";
};

export const getQuoteBodyText = (quote) =>
  splitQuoteSourceFromText(getQuoteText(quote)).quoteText;

export const getQuoteChapter = (quote) =>
  quote && typeof quote === "object" && typeof quote.chapter === "string"
    ? quote.chapter.trim()
    : "";

export const getQuoteSection = (quote) =>
  quote && typeof quote === "object" && typeof quote.section === "string"
    ? quote.section.trim()
    : "";

const getQuoteRawContentHtml = (quote) => {
  if (typeof quote === "string") return escapeHtml(quote.trim());
  if (!quote || typeof quote !== "object") return "";
  if (typeof quote.content === "string") return sanitizeInlineHtml(quote.content);
  if (typeof quote.text === "string") return escapeHtml(quote.text.trim());
  return "";
};

export const getQuoteSourceLabel = (quote) => {
  const legacyLabel = [getQuoteChapter(quote), getQuoteSection(quote)]
    .filter(Boolean)
    .join(" / ");

  if (legacyLabel) return legacyLabel;

  return splitQuoteSourceFromText(getQuoteText(quote)).source;
};

export const getQuoteContentHtml = (quote) => {
  const rawContent = getQuoteRawContentHtml(quote);
  if (!getQuoteSourceLabel(quote)) return rawContent;
  return stripLeadingSourceHtml(rawContent);
};

export const normalizeQuotes = (quotes) => {
  if (Array.isArray(quotes)) {
    return quotes.filter((quote) => getQuoteText(quote));
  }

  if (typeof quotes === "string") {
    return quotes
      .split("\n")
      .map((quote) => quote.trim())
      .filter(Boolean);
  }

  return [];
};

export const countQuotes = (quotes) => normalizeQuotes(quotes).length;

export const quotesToEditorHtml = (quotes) => {
  const normalizedQuotes = normalizeQuotes(quotes);
  return normalizedQuotes
    .map((quote) => `<p>${getQuoteRawContentHtml(quote)}</p>`)
    .join("");
};

export const editorHtmlToQuotes = (html) => {
  if (!html || !getTextFromHtml(html)) return [];

  if (typeof window === "undefined" || !window.document) {
    return getTextFromHtml(html)
      .split("\n")
      .map((quote) => quote.trim())
      .filter(Boolean);
  }

  const container = window.document.createElement("div");
  container.innerHTML = html;

  const blocks = Array.from(container.children).filter((child) =>
    ["p", "div", "blockquote"].includes(child.tagName.toLowerCase()),
  );
  const quoteNodes = blocks.length > 0 ? blocks : [container];

  return quoteNodes
    .map((node) => ({
      content: sanitizeInlineHtml(node.innerHTML),
      text: node.textContent?.trim() || "",
    }))
    .filter((quote) => quote.text)
    .map((quote) =>
      quote.content === escapeHtml(quote.text) ? quote.text : quote,
    );
};
