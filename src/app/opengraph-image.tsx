import { ImageResponse } from "next/og"

export const alt =
  "Track Taka: free expense tracker that keeps your data on your phone"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0069a8",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="88" height="88" viewBox="0 0 512 512">
          <rect width="512" height="512" rx="112" fill="#ffffff" />
          <g
            fill="none"
            stroke="#0069a8"
            strokeWidth="46"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(10 -14)"
          >
            <path d="M138 172 A40 40 0 0 1 218 172 L218 330 C218 408 296 436 350 396 C392 364 384 306 338 306 C312 306 304 328 318 342" />
            <path d="M120 246 H302" />
          </g>
        </svg>
        <div style={{ fontSize: 40, fontWeight: 600 }}>Track Taka</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          Track every taka. Nothing leaves your phone.
        </div>
        <div style={{ fontSize: 32, opacity: 0.85 }}>
          Open source. Works offline. No account needed.
        </div>
      </div>
    </div>,
    size
  )
}
