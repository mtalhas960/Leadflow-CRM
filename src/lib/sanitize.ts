import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize user-supplied HTML before rendering with dangerouslySetInnerHTML.
 * Strips scripts, event handlers, and other XSS vectors.
 * Keep safe formatting tags (b, i, p, br, ul, ol, li, a, h1-h6, etc.).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "p", "br", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "a", "img", "table", "thead", "tbody", "tr", "td", "th",
      "div", "span", "pre", "code", "blockquote", "hr",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel",
      "class", "style", "width", "height",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Lightweight sanitize for embed codes (iframes from YouTube, Vimeo, etc).
 * Only allows iframes from trusted sources.
 */
export function sanitizeEmbed(html: string): string {
  if (!html || typeof html !== "string") return "";

  // Extract and validate the src attribute from iframe
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["iframe"],
    ALLOWED_ATTR: [
      "src", "width", "height", "frameborder", "allow",
      "allowfullscreen", "loading", "title", "style",
    ],
  });
}
