import type { LovesCopy } from "./copy";

export interface IdeaProps {
  c: LovesCopy;
}

/** The small red kicker and heading every idea opens with, as on the home. */
export function LovesHeading({ c, id }: { c: LovesCopy; id: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
        {c.kicker}
      </span>
      <h2 className="text-heading" id={id}>
        {c.title}
      </h2>
    </div>
  );
}
