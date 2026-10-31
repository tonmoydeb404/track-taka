import { useId } from "react"

/**
 * The brand mark: a drawn Bangladeshi taka sign (৳) on the brand blue tile,
 * identical to src/app/icon.svg, the generated PWA icons (public/icons) and
 * the lockups in public/brand. Colours are the brand's own, not theme tokens,
 * so it reads the same on every surface; size it with className.
 */
export function BrandMark({
  className,
  label = "Track Taka",
}: {
  className?: string
  /** Accessible name; pass an empty string when a visible label sits next to it. */
  label?: string
}) {
  const gradientId = useId()
  return (
    <svg
      viewBox="0 0 512 512"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a7fc4" />
          <stop offset="1" stopColor="#004f82" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill={`url(#${gradientId})`} />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="46"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(10 -14)"
      >
        <path d="M138 172 A40 40 0 0 1 218 172 L218 330 C218 408 296 436 350 396 C392 364 384 306 338 306 C312 306 304 328 318 342" />
        <path d="M120 246 H302" />
      </g>
    </svg>
  )
}
