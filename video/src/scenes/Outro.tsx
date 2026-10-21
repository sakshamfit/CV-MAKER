import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Cursor, FONT, Icon, LightBg, Logo, Rise, Words, clamp, usePop } from "../theme";

// 26–30s: the call to action.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const button = usePop(44);
  const press = interpolate(frame, [80, 84, 90], [0, 1, 0], clamp);
  const glow = interpolate(frame, [84, 108], [0, 1], clamp);
  const nudge = interpolate(frame, [84, 92], [0, 8], clamp);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
        <Words text="Don’t just send your CV." delay={2} style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink }} />
        <Words text="Let people experience it." delay={14} highlight={["Let", "people", "experience", "it"]} style={{ marginTop: 6, fontSize: 88, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink }} />
      </div>
      <Rise delay={32} distance={30} style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Logo width={440} />
      </Rise>
      <div style={{ position: "absolute", top: 680, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${button * (1 - press * 0.05)})`, opacity: Math.min(1, button) }}>
          {glow > 0 && glow < 1 && (
            <div style={{ position: "absolute", inset: -24 * glow, borderRadius: 999, border: `3px solid ${C.blue}`, opacity: 1 - glow }} />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "28px 50px", borderRadius: 999, background: C.blue, color: "#fff", fontFamily: FONT, fontSize: 32, fontWeight: 700, boxShadow: "0 18px 40px rgba(6,99,252,.35)" }}>
            Create your resume
            <Icon name="arrow" size={32} color="#fff" stroke={2.4} style={{ transform: `translateX(${nudge}px)` }} />
          </div>
        </div>
      </div>
      <Rise delay={56} distance={16} style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 28, fontWeight: 600, color: C.muted, letterSpacing: ".02em" }}>
        cv-maker.app
      </Rise>
      <Cursor path={[{ f: 58, x: 1380, y: 940 }, { f: 79, x: 1000, y: 722 }, { f: 120, x: 1000, y: 722 }]} clickAt={84} />
    </AbsoluteFill>
  );
};
