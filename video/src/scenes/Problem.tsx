import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Eyebrow, FONT, GreyBg, Icon, Rise, Words, clamp } from "../theme";

const Paper: React.FC<{ name: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ name, style, children }) => (
  <div
    style={{
      position: "absolute",
      width: 400,
      height: 520,
      left: -200,
      top: -260,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 24px 60px rgba(40,60,90,.16)",
      padding: "54px 40px",
      fontFamily: FONT,
      ...style,
    }}
  >
    <div style={{ position: "absolute", top: -22, left: 22, background: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 19, fontWeight: 600, color: "#5b6b80", boxShadow: "0 6px 16px rgba(40,60,90,.12)", display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{ background: "#e5484d", color: "#fff", borderRadius: 5, padding: "2px 7px", fontSize: 13, fontWeight: 800 }}>PDF</span>
      {name}
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, color: "#2b3d55", letterSpacing: "-0.03em" }}>Alex Morgan</div>
    <div style={{ fontSize: 17, color: C.soft, marginTop: 4 }}>Product designer</div>
    <div style={{ height: 2, background: "#e7ecf2", margin: "24px 0" }} />
    {[["EXPERIENCE", [100, 92, 70]], ["EDUCATION", [96, 60]], ["SKILLS", [84, 50]]].map(([label, bars]) => (
      <div key={label as string} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", color: "#7a8ba0", marginBottom: 12 }}>{label as string}</div>
        {(bars as number[]).map((w, i) => (
          <div key={i} style={{ height: 9, width: `${w}%`, background: "#e6ebf1", borderRadius: 3, marginBottom: 10 }} />
        ))}
      </div>
    ))}
    {children}
  </div>
);

const FILES = [
  { name: "resume_v2.pdf", x: -175, y: -40, rot: -13 },
  { name: "resume_final.pdf", x: 160, y: -70, rot: 10 },
  { name: "resume_FINAL_v3.pdf", x: -120, y: 95, rot: -5 },
  { name: "resume_design_roles.pdf", x: 165, y: 85, rot: 12 },
];

const PAINS = ["Resend a new file for every update", "A different version for every role", "Your best work never fits on one page"];

// 3–8s: why a static resume falls short.
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const main = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 26 });
  const stamp = spring({ frame: frame - 98, fps, config: { damping: 11, stiffness: 160 } });
  const shake = interpolate(frame, [98, 102, 106, 110, 114], [0, -10, 8, -4, 0], clamp);

  return (
    <AbsoluteFill>
      <GreyBg />
      <div style={{ position: "absolute", left: 230, top: 250, width: 690, fontFamily: FONT }}>
        <Rise delay={2}><Eyebrow color={C.soft}>THE PROBLEM</Eyebrow></Rise>
        <Words text="A resume is a snapshot." delay={8} style={{ marginTop: 26, fontSize: 80, fontWeight: 800, letterSpacing: "-0.045em", color: C.ink, lineHeight: 1.04 }} />
        <Words text="It’s outdated the moment you send it." delay={26} stagger={2} style={{ marginTop: 18, fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", color: C.muted, lineHeight: 1.2 }} />
        <div style={{ marginTop: 48, display: "grid", gap: 22 }}>
          {PAINS.map((pain, i) => (
            <Rise key={pain} delay={52 + i * 10} distance={30} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#34495f" }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "#fde8de", display: "grid", placeItems: "center" }}>
                <Icon name="x" size={22} color={C.amber} stroke={3} />
              </span>
              {pain}
            </Rise>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 1300, top: 560 }}>
        {FILES.map((file, i) => {
          const p = spring({ frame: frame - 30 - i * 11, fps, config: { damping: 15, stiffness: 140 } });
          return (
            <Paper
              key={file.name}
              name={file.name}
              style={{
                opacity: Math.min(1, p * 1.4) * 0.92,
                transform: `translate(${file.x * p}px, ${file.y * p}px) rotate(${file.rot * p}deg) scale(${0.7 + 0.25 * p})`,
              }}
            />
          );
        })}
        <Paper
          name="resume.pdf"
          style={{ opacity: main, transform: `translate(${shake}px, ${(1 - main) * 60}px) rotate(-2deg)`, filter: `grayscale(${interpolate(frame, [98, 112], [0, 1], clamp)})` }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 200,
              padding: "12px 26px",
              border: `6px solid ${C.amber}`,
              borderRadius: 12,
              color: C.amber,
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: ".08em",
              background: "rgba(255,255,255,.85)",
              opacity: Math.min(1, stamp * 2),
              transform: `rotate(-14deg) scale(${2.2 - 1.2 * stamp})`,
            }}
          >
            OUTDATED
          </div>
        </Paper>
        <Rise delay={112} distance={20} style={{ position: "absolute", left: -170, top: 300, width: 340, textAlign: "center", fontFamily: FONT, fontSize: 22, color: "#6b7c90" }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: C.amber, marginRight: 10 }} />
          Sent 8 months ago
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
