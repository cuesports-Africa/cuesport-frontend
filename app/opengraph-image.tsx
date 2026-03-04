import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CueSports Africa - Africa's Premier Cue Sport Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #03090a 0%, #05161a 40%, #0a2a2f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative pool table felt texture lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            opacity: 0.06,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, #00bfbf 40px, #00bfbf 41px)",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
            background: "linear-gradient(90deg, #00bfbf, #ffd54f, #00f5ff)",
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
            background: "linear-gradient(90deg, #00f5ff, #ffd54f, #00bfbf)",
          }}
        />

        {/* Decorative cue stick diagonal */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "80px",
            width: "3px",
            height: "350px",
            display: "flex",
            background: "linear-gradient(180deg, transparent, #ffd54f 40%, #c49b30 60%, #8b6914)",
            transform: "rotate(35deg)",
            opacity: 0.3,
          }}
        />

        {/* Decorative circle (billiard ball hint) */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "100px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            border: "2px solid rgba(0, 191, 191, 0.15)",
            background: "radial-gradient(circle at 35% 35%, rgba(0, 245, 255, 0.08), transparent)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            zIndex: 1,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "82px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              CueSports
            </span>
            <span
              style={{
                fontSize: "82px",
                fontWeight: 800,
                color: "#ffd54f",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              Africa
            </span>
          </div>

          {/* Divider line */}
          <div
            style={{
              width: "120px",
              height: "3px",
              display: "flex",
              background: "linear-gradient(90deg, transparent, #00bfbf, transparent)",
              marginTop: "8px",
              marginBottom: "8px",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#b0bec5",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            {"Africa's Premier Cue Sport Platform"}
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {["Tournaments", "Rankings", "Live Scores"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "8px 24px",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 191, 191, 0.3)",
                  background: "rgba(0, 191, 191, 0.08)",
                  color: "#00f5ff",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            display: "flex",
            fontSize: "18px",
            color: "rgba(176, 190, 197, 0.6)",
            letterSpacing: "2px",
          }}
        >
          cuesports.africa
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
