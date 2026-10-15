import { Link } from "@tanstack/react-router";

import brandLogo from "@/assets/brand/erich-haldi-alpine-logo.png";

export function BrandLogo({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <Link
      aria-label={label}
      className="inline-flex max-w-full rounded-lg outline-none focus-visible:focus-ring"
      to="/"
    >
      <img
        alt=""
        className={
          compact
            ? "h-11 w-auto max-w-[180px] object-contain object-left"
            : "h-auto max-h-16 w-[190px] max-w-full object-contain object-left sm:w-[232px]"
        }
        height={823}
        src={brandLogo}
        width={1911}
      />
    </Link>
  );
}
