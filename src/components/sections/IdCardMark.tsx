/**
 * Text wordmark standing in for the JLM logo until the board supplies the
 * official logo files (docs/OPEN_QUESTIONS.md #4). Decorative: the
 * organisation name is always rendered as real text next to it.
 */
export function IdCardMark({ size = "md" }: { size?: "md" | "lg" }) {
  const dimensions = size === "lg" ? "size-24 text-3xl" : "size-16 text-xl";
  return (
    <span
      aria-hidden="true"
      className={`bg-primary text-primary-contrast inline-flex shrink-0 items-center justify-center rounded-3xl font-semibold tracking-tight ${dimensions}`}
    >
      JLM
    </span>
  );
}
