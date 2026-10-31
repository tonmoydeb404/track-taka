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
          <path
            d="M168 150h176M168 214h176M200 150c80 0 112 40 112 82s-32 82-112 82l120 100"
            fill="none"
            stroke="#0069a8"
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
