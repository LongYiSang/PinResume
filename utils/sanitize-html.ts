const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "span",
]);

const ALLOWED_ATTRS = new Set(["href", "target", "rel", "dir"]);

function isSafeHref(href: string) {
  const trimmed = href.trim().toLowerCase();
  if (trimmed === "") return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return true;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  );
}

function sanitizeElement(element: Element) {
  const tagName = element.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    const parent = element.parentNode;
    if (!parent) return;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
    return;
  }

  for (const attr of Array.from(element.attributes)) {
    const name = attr.name.toLowerCase();

    if (name.startsWith("on")) {
      element.removeAttribute(attr.name);
      continue;
    }

    if (name.startsWith("data-lexical-")) {
      continue;
    }

    if (!ALLOWED_ATTRS.has(name)) {
      element.removeAttribute(attr.name);
      continue;
    }

    if (name === "href" && !isSafeHref(attr.value)) {
      element.removeAttribute(attr.name);
      continue;
    }
  }

  if (tagName === "a") {
    const target = element.getAttribute("target");
    if (target && target !== "_blank") {
      element.removeAttribute("target");
    }
    const rel = element.getAttribute("rel") ?? "";
    const needed = ["noopener", "noreferrer", "nofollow"];
    const relSet = new Set(rel.split(/\s+/).filter(Boolean));
    needed.forEach((v) => relSet.add(v));
    element.setAttribute("rel", Array.from(relSet).join(" "));
  }
}

export function sanitizeLexicalHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.querySelectorAll("*"));

  for (const el of elements) {
    sanitizeElement(el);
  }

  return doc.body.innerHTML;
}

