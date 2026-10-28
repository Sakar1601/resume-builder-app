import { ImageResponse } from "next/og"

export const alt = "ResumeBuilder: tailor your resume to any job, honestly"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f8f5ee", color: "#171513", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect x="1" y="1" width="30" height="30" rx="8" fill="#171513" />
            <path d="M9.5 7.5h9.2l4.8 4.8v12.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" fill="#f8f5ee" />
            <path d="M18.7 7.5v4.8h4.8" fill="#e2420b" />
            <path d="M12 16.5h8M12 19.5h8M12 22h4.5" stroke="#171513" strokeWidth="1.4" strokeLinecap="round" opacity=".75" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
            Resume<span style={{ color: "#e2420b" }}>Builder</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}>
            <span>Land your dream job</span>
            <span style={{ color: "#e2420b" }}>faster</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#6b645b", marginTop: 28 }}>
            AI that sharpens your real experience. It never makes things up.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
