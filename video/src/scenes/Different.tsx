import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CARD, Cursor, Eyebrow, FONT, Icon, LightBg, Rise, Words, clamp, usePop, ProjectArt } from "../theme";

const BEAT = 75;

// Left-hand copy shared by the three beats.
const BeatCopy: React.FC<{ n: string; title: string; highlight: string[]; sub: string }> = ({ n, title, highlight, sub }) => {
  const badge = usePop(0);
  return (
    <div style={{ position: "absolute", left: 230, top: 330, width: 620, fontFamily: FONT }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 800, transform: `scale(${badge})`, boxShadow: "0 12px 30px rgba(6,99,252,.3)" }}>{n}</div>
      <Words text={title} delay={4} stagger={2} highlight={highlight} style={{ marginTop: 30, fontSize: 62, fontWeight: 800, letterSpacing: "-0.045em", color: C.ink, lineHeight: 1.06 }} />
      <Rise delay={16} distance={24} style={{ marginTop: 26, fontSize: 29, lineHeight: 1.45, color: C.muted }}>{sub}</Rise>
    </div>
  );
};

// Fades a beat out over its last frames so the next one can take over.
const BeatExit: React.FC<{ last?: boolean; children: React.ReactNode }> = ({ last, children }) => {
  const frame = useCurrentFrame();
  const out = last ? 0 : interpolate(frame, [BEAT - 10, BEAT], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>{children}</AbsoluteFill>;
};

const DESTINATIONS: { label: string; icon: "mail" | "people" | "file" | "briefcase"; x: number }[] = [
  { label: "Email", icon: "mail", x: 1010 },
  { label: "LinkedIn", icon: "people", x: 1200 },
  { label: "Applications", icon: "file", x: 1390 },
  { label: "Recruiters", icon: "briefcase", x: 1580 },
];

const OneLink: React.FC = () => {
  const frame = useCurrentFrame();
  const copied = frame >= 25;
  const draw = interpolate(frame, [26, 42], [1, 0], clamp);
  const travel = interpolate(frame, [34, 52], [0, 1], clamp);
  const badge = usePop(52);
  return (
    <BeatExit>
      <BeatCopy n="01" title="One link. Always up to date." highlight={["Always", "up", "to", "date"]} sub="Update once and everyone sees the latest you. No more resending files." />
      <Rise delay={4} distance={30} style={{ position: "absolute", left: 940, top: 330, width: 720, height: 96, ...CARD, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 16px 0 22px", fontFamily: FONT }}>
        <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#e4f1ff", display: "grid", placeItems: "center" }}><Icon name="link" size={26} color={C.blue} /></span>
        <span style={{ fontSize: 27, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>cv-maker.app/id/GID-12345-67890</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 14, background: copied ? C.green : C.blue, color: "#fff", fontWeight: 700, fontSize: 21, transform: `scale(${frame >= 22 && frame <= 27 ? 0.94 : 1})` }}>
          <Icon name={copied ? "check" : "copy"} size={20} color="#fff" stroke={2.6} />
          {copied ? "Copied" : "Copy"}
        </span>
      </Rise>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {DESTINATIONS.map((d) => {
          const path = `M1300 426 C 1300 500, ${d.x} 480, ${d.x} 552`;
          return (
            <g key={d.label}>
              <path d={path} fill="none" stroke="#9ccaff" strokeWidth="3" strokeDasharray="1" pathLength={1} strokeDashoffset={draw} />
              {travel > 0 && travel < 1 && (
                <circle r="9" fill={C.blue} cx={interpolate(travel, [0, 1], [1300, d.x])} cy={interpolate(travel, [0, 0.5, 1], [426, 488, 552])} />
              )}
            </g>
          );
        })}
      </svg>
      {DESTINATIONS.map((d, i) => {
        const p = usePop(30 + i * 4);
        const done = usePop(50 + i * 2);
        return (
          <div key={d.label} style={{ position: "absolute", left: d.x - 70, top: 552, width: 140, textAlign: "center", fontFamily: FONT, transform: `scale(${p})`, opacity: Math.min(1, p) }}>
            <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto", borderRadius: "50%", ...CARD, display: "grid", placeItems: "center" }}>
              <Icon name={d.icon} size={38} color={C.blue} />
              <span style={{ position: "absolute", right: -6, top: -6, width: 34, height: 34, borderRadius: "50%", background: C.green, display: "grid", placeItems: "center", transform: `scale(${done})` }}>
                <Icon name="check" size={20} color="#fff" stroke={3} />
              </span>
            </div>
            <div style={{ marginTop: 14, fontSize: 22, fontWeight: 600, color: C.ink }}>{d.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1300 - 250, top: 760, width: 500, textAlign: "center", transform: `scale(${badge})`, opacity: Math.min(1, badge) }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 26px", borderRadius: 999, background: "#e9f9f1", color: "#14804c", fontFamily: FONT, fontWeight: 700, fontSize: 22 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.green }} />
          Updated once · live everywhere
        </span>
      </div>
      <Cursor path={[{ f: 6, x: 1480, y: 720 }, { f: 21, x: 1592, y: 382 }, { f: 75, x: 1592, y: 382 }]} clickAt={24} />
    </BeatExit>
  );
};

const PROJECT_CARDS = [
  { kind: "analytics" as const, title: "Horizon", sub: "Analytics dashboard", x: -255, rot: -7, y: 34, delay: 8 },
  { kind: "research" as const, title: "Journey", sub: "User research", x: 255, rot: 7, y: 34, delay: 14 },
  { kind: "finance" as const, title: "Finly", sub: "Fintech app", x: 0, rot: 0, y: 0, delay: 2 },
];
const SKILLS = ["Product design", "UX research", "Prototyping", "Design systems"];

const ShowWork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <BeatExit>
      <BeatCopy n="02" title="Show your work, not just bullet points." highlight={["work,"]} sub="Projects, skills and results, told as one visual story." />
      {PROJECT_CARDS.map((card, i) => {
        const p = spring({ frame: frame - card.delay, fps, config: { damping: 16, stiffness: 120 } });
        const float = Math.sin((frame + i * 20) / 16) * 6;
        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: 1280 - 150 + card.x * p,
              top: 300 + card.y + float + (1 - p) * 220,
              width: 300,
              ...CARD,
              borderRadius: 20,
              overflow: "hidden",
              fontFamily: FONT,
              opacity: Math.min(1, p * 1.5),
              transform: `rotate(${card.rot * p}deg)`,
            }}
          >
            <ProjectArt kind={card.kind} width={300} height={190} />
            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em" }}>{card.title}</div>
              <div style={{ fontSize: 18, color: C.muted, marginTop: 4 }}>{card.sub}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 880, width: 800, top: 720, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {SKILLS.map((skill, i) => {
          const p = usePop(30 + i * 5);
          return (
            <span key={skill} style={{ padding: "12px 22px", borderRadius: 999, background: "#fff", border: "1px solid #cfe5ff", color: C.blue, fontFamily: FONT, fontWeight: 700, fontSize: 21, transform: `scale(${p})`, opacity: Math.min(1, p), boxShadow: "0 8px 20px rgba(29,79,138,.08)" }}>{skill}</span>
          );
        })}
      </div>
    </BeatExit>
  );
};

const SUGGESTIONS = ["Highlight relevant experience", "Suggest key skills", "Improve your summary"];

const AiInsights: React.FC = () => {
  const frame = useCurrentFrame();
  const views = Math.round(interpolate(frame, [12, 50], [0, 128], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }));
  const bars = [38, 52, 44, 66, 58, 82, 100];
  return (
    <BeatExit last>
      <BeatCopy n="03" title="Tailor with AI. Learn from every view." highlight={["AI.", "every", "view."]} sub="Suggestions for each role you apply to, and insight into how people engage." />
      <Rise delay={2} distance={30} style={{ position: "absolute", left: 900, top: 300, width: 440, ...CARD, padding: 30, fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: "grid", placeItems: "center" }}><Icon name="spark" size={26} color="#fff" /></span>
          <div>
            <div style={{ fontSize: 25, fontWeight: 800, color: C.ink }}>Tailor for this job</div>
            <div style={{ fontSize: 17, color: C.muted }}>Product Designer · Fintech</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
          {SUGGESTIONS.map((s, i) => {
            const done = frame >= 16 + i * 10;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 14, border: `1px solid ${done ? "#9ccaff" : C.line}`, background: done ? "#f1f8ff" : "#fff", fontSize: 19, fontWeight: 600, color: done ? C.ink : C.muted }}>
                {s}
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: done ? C.blue : "#eef4fa", display: "grid", placeItems: "center" }}>
                  <Icon name={done ? "check" : "plus"} size={18} color={done ? "#fff" : C.muted} stroke={3} />
                </span>
              </div>
            );
          })}
        </div>
      </Rise>
      <Rise delay={8} distance={30} style={{ position: "absolute", left: 1370, top: 350, width: 320, ...CARD, padding: 28, fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 19, color: C.muted, fontWeight: 600 }}><Icon name="eye" size={22} color={C.blue} />Profile views</div>
        <div style={{ fontSize: 68, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", marginTop: 6 }}>{views}</div>
        <div style={{ fontSize: 17, color: C.green, fontWeight: 700 }}>▲ this week</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginTop: 20 }}>
          {bars.map((h, i) => {
            const grow = interpolate(frame, [14 + i * 3, 30 + i * 3], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
            return <div key={i} style={{ flex: 1, height: `${h * grow}%`, borderRadius: 6, background: i === bars.length - 1 ? `linear-gradient(${C.cyan}, ${C.blue})` : "#cfe5ff" }} />;
          })}
        </div>
      </Rise>
    </BeatExit>
  );
};

// 13–23s: what makes CV-MAKER different from a resume builder.
export const Different: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [30, 44], [0, 100], clamp);
  const out = interpolate(frame, [70, 84], [0, 1], clamp);
  const label = interpolate(frame, [84, 96], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <LightBg waves={false} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-out * 60}px)` }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Words text="Resume builders make documents." delay={2} style={{ fontSize: 70, fontWeight: 800, letterSpacing: "-0.045em", color: C.soft }} />
          <div style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${strike}%`, background: C.amber, borderRadius: 4 }} />
        </div>
        <Words text="CV-MAKER builds your career identity." delay={34} highlight={["career", "identity"]} style={{ marginTop: 26, fontSize: 92, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 230, top: 200, opacity: label, transform: `translateY(${(1 - label) * 20}px)` }}>
        <Eyebrow>WHY CV-MAKER IS DIFFERENT</Eyebrow>
      </div>
      <Sequence from={84} durationInFrames={BEAT} premountFor={15}><OneLink /></Sequence>
      <Sequence from={84 + BEAT} durationInFrames={BEAT} premountFor={15}><ShowWork /></Sequence>
      <Sequence from={84 + BEAT * 2} premountFor={15}><AiInsights /></Sequence>
    </AbsoluteFill>
  );
};
