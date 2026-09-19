import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ElectroMov — Cargá tu auto eléctrico en casa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #071612 0%, #0b1f17 55%, #06663f 100%)",
          padding: 72,
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#21dd93",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            ⚡
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>ElectroMov</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 940 }}>
            Cargá tu auto en casa. Gastá 90% menos que con nafta.
          </div>
          <div style={{ fontSize: 30, color: "#8ff9cd", maxWidth: 900 }}>
            Wallbox, cables Tipo 2 y cargadores portátiles con garantía local en Argentina.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "rgba(255,255,255,0.65)" }}>
          <div>Certificación CE</div>
          <div>·</div>
          <div>12 cuotas sin interés</div>
          <div>·</div>
          <div>Envío a todo el país</div>
        </div>
      </div>
    ),
    size,
  );
}
