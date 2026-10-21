import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CARD, Eyebrow, FONT, Icon, LightBg, Logo, Rise, Words, clamp, usePop, Avatar, ProjectArt } from "../theme";

const PROJECTS = [
  { kind: "finance" as const, title: "Finly", sub: "Fintech app" },
  { kind: "analytics" as const, title: "Horizon", sub: "Analytics dashboard" },
  { kind: "research" as const, title: "Journey", sub: "User research" },
];

const ORBIT: { label: string; icon: "briefcase" | "grid" | "skill" | "school" | "award" | "goal"; x: number; y: number }[] = [
  { label: "Experience", icon: "briefcase", x: 250, y: 400 },
  { label: "Projects", icon: "grid", x: 210, y: 590 },
  { label: "Skills", icon: "skill", x: 280, y: 780 },
  { label: "Education", icon: "school", x: 1460, y: 380 },
  { label: "Achievements", icon: "award", x: 1450, y: 580 },
  { label: "Goals", icon: "goal", x: 1500, y: 790 },
];

const Pill: React.FC<{ label: string; icon: (typeof ORBIT)[number]["icon"]; delay: number; x: number; y: number; seed: number }> = ({ label, icon, delay, x, y, seed }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay);
  const float = Math.sin((frame + seed * 17) / 18) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 24px",
        borderRadius: 999,
        background: "#fff",
        border: "1px solid #cfe5ff",
        boxShadow: "0 16px 40px rgba(29,79,138,.16)",
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 700,
        color: C.ink,
        opacity: Math.min(1, p),
        transform: `scale(${p})`,
      }}
    >
      <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#e4f1ff", display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={22} color={C.blue} />
      </span>
      {label}
    </div>
  );
};

// 8–13s: the PDF becomes a living profile.
export const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - 2, fps, config: { damping: 200 }, durationInFrames: 30 });
  const width = interpolate(grow, [0, 1], [400, 1060]);
  const height = interpolate(grow, [0, 1], [520, 600]);
  const pulse = (Math.sin(frame / 5) + 1) / 2;
  const toast = spring({ frame: frame - 112, fps, config: { damping: 16, stiffness: 150 } });

  return (
    <AbsoluteFill>
      <LightBg waves={false} />
      <div style={{ position: "absolute", top: 104, left: 0, right: 0, textAlign: "center" }}>
        <Rise delay={0}><Eyebrow>INTRODUCING CV-MAKER</Eyebrow></Rise>
        <Words text="Meet your Digital Career Identity." delay={6} highlight={["Digital", "Career", "Identity"]} style={{ marginTop: 20, fontSize: 74, fontWeight: 800, letterSpacing: "-0.045em", color: C.ink }} />
      </div>

      <div style={{ position: "absolute", left: 960 - width / 2, top: 300, width, height, ...CARD, overflow: "hidden", fontFamily: FONT }}>
        <div style={{ position: "absolute", inset: 0, padding: "30px 44px", opacity: interpolate(frame, [16, 30], [0, 1], clamp) }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Logo width={150} />
            <div style={{ display: "flex", gap: 30, fontSize: 19, color: C.muted }}>
              <span style={{ color: C.ink, fontWeight: 700, borderBottom: `3px solid ${C.blue}`, paddingBottom: 6 }}>About</span>
              <span>Experience</span><span>Projects</span><span>Skills</span><span>Education</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: "#e9f9f1", color: C.green, fontWeight: 700, fontSize: 18 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 ${4 + pulse * 6}px rgba(33,178,107,${0.25 - pulse * 0.2})` }} />
              Live
            </div>
          </div>
          {/* Person */}
          <div style={{ display: "flex", gap: 36, marginTop: 34 }}>
            <Rise delay={22} distance={24}>
              <Avatar initials="AM" size={170} />
            </Rise>
            <div style={{ flex: 1 }}>
              <Rise delay={26} distance={24} style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.04em", color: C.ink }}>Alex Morgan</Rise>
              <Rise delay={30} distance={24} style={{ fontSize: 24, fontWeight: 700, color: C.blue, marginTop: 4 }}>Product designer</Rise>
              <Rise delay={34} distance={24} style={{ fontSize: 21, color: C.muted, marginTop: 14, maxWidth: 560, lineHeight: 1.5 }}>
                I design human-centered products that make a difference.
              </Rise>
              <Rise delay={38} distance={24} style={{ display: "flex", gap: 26, marginTop: 14, fontSize: 18, color: C.muted, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="location" size={20} color={C.muted} />Remote</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: C.green }} />Open to opportunities</span>
              </Rise>
            </div>
            <Rise delay={40} distance={24}>
              <div style={{ background: C.blue, color: "#fff", fontWeight: 700, fontSize: 20, padding: "14px 26px", borderRadius: 12 }}>Contact me</div>
            </Rise>
          </div>
          {/* Projects */}
          <Rise delay={44} distance={20} style={{ marginTop: 30, fontSize: 20, fontWeight: 700, color: C.ink }}>Featured projects</Rise>
          <div style={{ display: "flex", gap: 30, marginTop: 14 }}>
            {PROJECTS.map((project, i) => (
              <Rise key={project.title} delay={48 + i * 6} distance={30} style={{ width: 304 }}>
                <ProjectArt kind={project.kind} width={304} height={112} radius={14} />
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginTop: 10 }}>{project.title}</div>
                <div style={{ fontSize: 16, color: C.muted }}>{project.sub}</div>
              </Rise>
            ))}
          </div>
        </div>
      </div>

      {ORBIT.map((item, i) => (
        <Pill key={item.label} {...item} delay={64 + i * 6} seed={i} />
      ))}

      <div
        style={{
          position: "absolute",
          left: 960 - 230,
          top: 930,
          width: 460,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 24px",
          borderRadius: 16,
          background: C.ink,
          color: "#fff",
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          boxShadow: "0 20px 40px rgba(16,38,65,.25)",
          opacity: Math.min(1, toast),
          transform: `translateY(${(1 - toast) * 40}px)`,
        }}
      >
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: C.green, display: "grid", placeItems: "center" }}>
          <Icon name="check" size={20} color="#fff" stroke={3} />
        </span>
        New project added · live just now
      </div>
    </AbsoluteFill>
  );
};
