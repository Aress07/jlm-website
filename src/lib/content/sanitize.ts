import "server-only";
import sanitizeHtml from "sanitize-html";

/** Rich-text allow-list for post bodies (master plan Section 8.4). */
const allowedTags = [
  "p",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "blockquote",
  "img",
  "figure",
  "figcaption",
];

export function sanitizePostBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt"],
    },
  });
}
