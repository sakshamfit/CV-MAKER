import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CARD, Eyebrow, FONT, LightBg, Rise, Words, clamp, usePop } from "../theme";

const STEPS = [
  { title: "Start your story", sub: "Build new or import your resume" },
  { title: "Make it yours", sub: "Edit experience, projects and skills" },
  { title: "Share one link", sub: "Publish your CV-MAKER identity" },
  { title: "Keep evolving", sub: "Update your story as you grow" },
];
const CARD_W = 330;
const GAP = 26;
const LEFT = (1920 - (CARD_W * 4 + GAP * 3)) / 2;
const TOP = 480;
const DOT = 64;

// 23–26s: four steps from first draft to next chapter.
export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [16, 58], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center" }}>
        <Rise delay={0}><Eyebrow>HOW IT WORKS</Eyebrow></Rise>
        <Words text="Start in minutes. Keep it growing." delay={4} highlight={["growing"]} style={{ marginTop: 20, fontSize: 76, fontWeight: 800, letterSpacing: "-0.045em", color: C.ink }} />
      </div>
      {STEPS.map((step, i) => {
        const p = usePop(14 + i * 9);
        return (
          <div key={step.title} style={{ position: "absolute", zIndex: 1, left: LEFT + i * (CARD_W + GAP), top: TOP, width: CARD_W, ...CARD, padding: "62px 30px 34px", fontFamily: FONT, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px)` }}>
            <div style={{ fontSize: 31, fontWeight: 800, letterSpacing: "-0.03em", color: C.ink }}>{step.title}</div>
            <div style={{ fontSize: 21, lineHeight: 1.45, color: C.muted, marginTop: 10 }}>{step.sub}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", zIndex: 2, left: LEFT + 30 + DOT / 2, top: TOP - 2, width: (CARD_W + GAP) * 3 * line, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})` }} />
      {STEPS.map((step, i) => {
        const p = usePop(14 + i * 9);
        const lit = line >= i / 3 - 0.001;
        return (
          <div key={step.title} style={{ position: "absolute", zIndex: 3, left: LEFT + i * (CARD_W + GAP) + 30, top: TOP - DOT / 2, width: DOT, height: DOT, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: FONT, fontSize: 24, fontWeight: 800, color: lit ? "#fff" : C.blue, background: lit ? `linear-gradient(135deg, ${C.blue}, ${C.cyan})` : "#e4f1ff", border: "4px solid #fff", boxShadow: lit ? "0 10px 24px rgba(6,99,252,.3)" : "0 6px 14px rgba(29,79,138,.1)", transform: `scale(${p})` }}>
            0{i + 1}
          </div>
        );
      })}
      <Rise delay={50} distance={20} style={{ position: "absolute", top: 790, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 25, color: C.muted }}>
        Start with the free builder · Export a PDF anytime · Live sharing on paid plans
      </Rise>
    </AbsoluteFill>
  );
};
