import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, LightBg, Logo, Rise, Words, clamp } from "../theme";

// 0–3s: the brand first, then the promise.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });
  const wipe = interpolate(frame, [2, 26], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shine = interpolate(frame, [20, 46], [-30, 130], clamp);
  const lift = spring({ frame: frame - 38, fps, config: { damping: 200 }, durationInFrames: 30 });

  return (
    <AbsoluteFill>
      <LightBg />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            mixBlendMode: "multiply",
            opacity: logoIn,
            clipPath: `inset(-10% ${wipe}% -10% 0)`,
            transform: `translateY(${-lift * 170}px) scale(${(0.9 + 0.1 * logoIn) * (1 - lift * 0.3)})`,
          }}
        >
          <Logo width={820} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${shine - 10}%, rgba(255,255,255,.85) ${shine}%, transparent ${shine + 10}%)` }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
        <Words
          text="Your career is bigger than a resume."
          delay={46}
          stagger={3}
          highlight={["bigger"]}
          style={{ fontSize: 92, fontWeight: 800, letterSpacing: "-0.045em", color: C.ink, lineHeight: 1.05 }}
        />
        <Rise delay={70} distance={30} style={{ marginTop: 34, fontFamily: FONT, fontSize: 34, color: "#47627f" }}>
          Your experience, skills and work, together in one living identity.
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
