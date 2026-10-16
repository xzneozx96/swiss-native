/**
 * Line drawings from the client's banner: the three selling-point icons (on a 40 x 40
 * grid, stroke 1.75 at any size), the small red heart and a pine silhouette.
 * All decorative: callers put the meaning in text.
 */
interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function Line({
  size = 40,
  strokeWidth = 1.75,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 40 40"
      width={size}
    >
      {children}
    </svg>
  );
}

const ns = { vectorEffect: "non-scaling-stroke" } as const;

/** A mountain outline: two peaks and a snow line. */
export function PassIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M3 33 15 12l6 9 5-7 11 19Z" {...ns} />
      <path d="m11.2 18.6 2.3 1.6 1.5-1.4 2.2 2.1 1.4-1.6" {...ns} />
      <path d="m23.6 17.4 1.6 1.2 1.6-1.4 1.8 1.6" {...ns} />
    </Line>
  );
}

/** A road winding away towards the horizon, with a dashed centre line. */
export function RoadIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M6 36c4-7 16-6 15-13-.7-5-8-6-6-12 1-2.4 3-4 5-5" {...ns} />
      <path d="M22 36c3-7 12-7 11-14-.6-5-9-6-8-12 .4-1.8 1.6-3 3-4" {...ns} />
      <path
        d="M14 36c3-7 12-6 11.6-13-.3-5-8.4-6-6.6-12 .6-1.9 2-3.4 4-4.6"
        strokeDasharray="2.4 3.2"
        {...ns}
      />
    </Line>
  );
}

/** Two pine trees on a ground line. */
export function PinesIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M14 5 7.5 16H11L5.5 26.5h17L17 16h3.5Z" {...ns} />
      <path d="M14 26.5V33" {...ns} />
      <path d="m27 13-5 8.5h2.8l-4.3 8h13l-4.3-8H32Z" {...ns} />
      <path d="M27 29.5V33" {...ns} />
      <path d="M3 33h34" {...ns} />
    </Line>
  );
}

/** The small red heart that ends the handwritten quote. */
export function Heart({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        className="fill-accent"
        d="M12 20.5c-.4 0-8.5-4.9-8.5-10.6C3.5 6.9 5.6 5 8 5c1.8 0 3.2 1 4 2.4C12.8 6 14.2 5 16 5c2.4 0 4.5 1.9 4.5 4.9 0 5.7-8.1 10.6-8.5 10.6Z"
      />
    </svg>
  );
}

/** A plain pine silhouette, filled with the current colour. */
export function PineSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 40 60"
    >
      <path d="M20 0 9 18h5L5 32h6L1 48h16v12h6V48h16L29 32h6l-9-14h5Z" />
    </svg>
  );
}
