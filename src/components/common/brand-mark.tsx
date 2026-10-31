import { BRAND_AMBER, BRAND_BLUE } from "@/lib/brand"

/**
 * The brand mark ("Daily Track"): a 3x3 field of entries with a bold route
 * stepping up through them and an amber marker on today, on the brand blue
 * tile. The brand source is public/brand/mark.svg; src/app/icon.svg, the
 * generated PWA icons (public/icons) and the lockups in public/brand are all
 * derived from it by `npm run sync-brand`. Colours are the brand's own, not theme
 * tokens, so it reads the same on every surface; size it with className.
 */
export function BrandMark({
  className,
  label = "Track Taka",
}: {
  className?: string
  /** Accessible name; pass an empty string when a visible label sits next to it. */
  label?: string
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <rect width="512" height="512" rx="112" fill={BRAND_BLUE} />
      <g>
        <circle cx="136" cy="136" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="256" cy="136" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="376" cy="136" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="136" cy="256" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="256" cy="256" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="376" cy="256" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="136" cy="376" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="256" cy="376" r="30" fill="#fff" fillOpacity="0.35" />
        <circle cx="376" cy="376" r="30" fill="#fff" fillOpacity="0.35" />
      </g>
      <path
        d="M136 376H256V256H376V136"
        fill="none"
        stroke="#fff"
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="376" cy="136" r="30" fill={BRAND_AMBER} />
    </svg>
  )
}
