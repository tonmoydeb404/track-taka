import { ImageResponse } from "next/og"

import { BRAND_AMBER, BRAND_BLUE } from "@/lib/brand"

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
        background: BRAND_BLUE,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="88" height="88" viewBox="0 0 512 512">
          <rect width="512" height="512" rx="112" fill="#ffffff" />
          <circle cx="136" cy="136" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="256" cy="136" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="376" cy="136" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="136" cy="256" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="256" cy="256" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="376" cy="256" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="136" cy="376" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="256" cy="376" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <circle cx="376" cy="376" r="30" fill={BRAND_BLUE} fillOpacity="0.25" />
          <path
            d="M136 376H256V256H376V136"
            fill="none"
            stroke={BRAND_BLUE}
            strokeWidth="60"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="376" cy="136" r="30" fill={BRAND_AMBER} />
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
