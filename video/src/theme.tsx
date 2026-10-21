import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Geist, the website's typeface (variable font, all weights in one file).
loadFont({ family: "Geist", url: staticFile("geist.woff2"), weight: "100 900" });

// Brand tokens, matching the CV-MAKER site.
export const C = {
  ink: "#102641",
  muted: "#647990",
  soft: "#8aa0b6",
  blue: "#0663fc",
  cyan: "#16b9ed",
  ice: "#eff8ff",
  line: "#e1edf7",
  navy: "#143451",
  green: "#21b26b",
  amber: "#f0742b",
};
export const FONT = "Geist, Arial, sans-serif";

// Initials avatar used instead of a photo, so the video has no generated imagery.
export const Avatar: React.FC<{ initials: string; size: number; radius?: number }> = ({ initials, size, radius = 20 }) => (
  <div style={{ width: size, height: size, borderRadius: radius, display: "grid", placeItems: "center", background: `linear-gradient(140deg, ${C.blue}, ${C.cyan})`, color: "#fff", fontFamily: FONT, fontSize: size * 0.36, fontWeight: 700, letterSpacing: "-0.02em", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.25)" }}>
    {initials}
  </div>
);

// Vector project previews (no photos): a small product UI for each kind of project.
export type ProjectKind = "finance" | "analytics" | "research";
export const ProjectArt: React.FC<{ kind: ProjectKind; width: number; height: number; radius?: number }> = ({ kind, width, height, radius = 0 }) => {
  const bars = [0.45, 0.7, 0.55, 0.85, 0.62, 0.95, 0.78];
  const box: React.CSSProperties = { width, height, borderRadius: radius, overflow: "hidden", position: "relative", fontFamily: FONT };
  if (kind === "finance") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#e8f1ff,#f5f9ff)" }}>
        <div style={{ position: "absolute", left: width * 0.08, top: height * 0.16, width: width * 0.46, height: height * 0.68, borderRadius: 12, background: C.blue, padding: height * 0.08, color: "#fff" }}>
          <div style={{ fontSize: height * 0.09, opacity: 0.8 }}>Balance</div>
          <div style={{ fontSize: Math.min(height * 0.17, width * 0.07), fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>$12,480</div>
          <div style={{ display: "flex", gap: 4, marginTop: height * 0.08 }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,.45)" }} />)}
          </div>
        </div>
        <div style={{ position: "absolute", right: width * 0.08, top: height * 0.16, width: width * 0.32, height: height * 0.68, borderRadius: 12, background: "#fff", padding: height * 0.07, display: "grid", gap: height * 0.05, alignContent: "start" }}>
          {[0.9, 0.6, 0.75, 0.5].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: height * 0.08, height: height * 0.08, borderRadius: "50%", background: i % 2 ? C.cyan : C.green }} />
              <div style={{ height: 4, width: `${w * 100}%`, borderRadius: 2, background: C.line }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "analytics") {
    return (
      <div style={{ ...box, background: "#f4f8fd" }}>
        <div style={{ position: "absolute", left: width * 0.07, right: width * 0.07, top: height * 0.14, display: "flex", gap: width * 0.03 }}>
          {[["Views", "1.2k"], ["Unique", "806"]].map(([k, v]) => (
            <div key={k} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: `${height * 0.05}px ${width * 0.03}px`, border: `1px solid ${C.line}` }}>
              <div style={{ fontSize: height * 0.07, color: C.muted }}>{k}</div>
              <div style={{ fontSize: height * 0.13, fontWeight: 700, color: C.ink }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: width * 0.07, right: width * 0.07, bottom: height * 0.12, height: height * 0.36, display: "flex", alignItems: "flex-end", gap: width * 0.02 }}>
          {bars.map((b, i) => <div key={i} style={{ flex: 1, height: `${b * 100}%`, borderRadius: 4, background: i === bars.length - 2 ? C.blue : "#b9d3fd" }} />)}
        </div>
      </div>
    );
  }
  const notes = ["#fff3c4", "#dcebff", "#e3f8ee", "#ffe4dc", "#ece4ff", "#dcebff"];
  return (
    <div style={{ ...box, background: "#f6f8fb" }}>
      <div style={{ position: "absolute", inset: `${height * 0.14}px ${width * 0.07}px`, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: width * 0.03 }}>
        {notes.map((bg, i) => (
          <div key={i} style={{ background: bg, borderRadius: 8, padding: height * 0.05, display: "grid", gap: 4, alignContent: "start" }}>
            <div style={{ height: 4, width: "80%", borderRadius: 2, background: "rgba(16,38,65,.25)" }} />
            <div style={{ height: 4, width: "55%", borderRadius: 2, background: "rgba(16,38,65,.15)" }} />
          </div>
        ))}
      </div>
    </div>
  );
};
export const GRADIENT_TEXT: React.CSSProperties = {
  backgroundImage: `linear-gradient(95deg, ${C.blue} 10%, ${C.cyan} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
export const CARD: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${C.line}`,
  borderRadius: 24,
  boxShadow: "0 30px 80px rgba(29,79,138,.14), 0 4px 14px rgba(29,79,138,.06)",
};

// ---------- Motion helpers ----------
export const useEnter = (delay = 0, durationInFrames = 26, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames });
};
export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 170 } });
};
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 46, style, children }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        filter: `blur(${(1 - p) * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Headline that rises in word by word. Words listed in `highlight` get the brand gradient.
export const Words: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  highlight?: string[];
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 3, highlight = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 200 }, durationInFrames: 24 });
        const lit = highlight.includes(word.replace(/[.,!?]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.55}em)`,
              filter: `blur(${(1 - p) * 6}px)`,
              ...(lit ? GRADIENT_TEXT : null),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Backgrounds ----------
const Blob: React.FC<{ x: number; y: number; size: number; color: string; speed?: number }> = ({ x, y, size, color, speed = 1 }) => {
  const f = useCurrentFrame() * speed;
  return (
    <div
      style={{
        position: "absolute",
        left: x + Math.sin(f / 45) * 40,
        top: y + Math.cos(f / 55) * 30,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
      }}
    />
  );
};

export const LightBg: React.FC<{ waves?: boolean }> = ({ waves = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#fbfdff 0%,#e9f5ff 42%,#cfe7fd 86%,#eef8ff 100%)", overflow: "hidden" }}>
      <Blob x={-200} y={-260} size={900} color="rgba(120,190,255,.35)" />
      <Blob x={1250} y={500} size={1000} color="rgba(22,185,237,.18)" speed={0.8} />
      {waves && (
        <svg viewBox="0 0 1440 430" preserveAspectRatio="none" style={{ position: "absolute", bottom: -2, left: -40, width: 2000, height: 330, transform: `translateX(${Math.sin(f / 60) * 20}px)` }}>
          <path fill="#e0f2ff" d="M0 70C105 125 56 370 252 350c182-20 413-52 597-127s356-137 591-223v430H0Z" />
          <path fill="#f0f8ff" d="M0 305c119-95 262-57 367-25s183 85 375 90 316-95 436-113 169-36 262-8v181H0Z" />
          <path fill="#fff" opacity=".76" d="M0 369c250-170 321-96 474-40s290 96 441 64 314-25 525-73v110H0Z" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const GreyBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg,#f5f7fa 0%,#e8edf3 55%,#dde4ec 100%)", overflow: "hidden" }}>
    <Blob x={1100} y={-300} size={900} color="rgba(160,176,196,.25)" />
  </AbsoluteFill>
);

// ---------- Brand pieces ----------
export const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => {
  const h = width * 0.26;
  const mark = h;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: h * 0.22, width, height: h, ...style }}>
      <svg width={mark} height={mark} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#0663FC" />
        <path d="M17 16v32h16" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="m33 21 8 24 10-29" stroke="#7ee5ff" strokeWidth="6" fill="none" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: h * 0.42, letterSpacing: "-0.045em", color: C.ink, lineHeight: 1 }}>CV-MAKER</span>
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.blue, style }) => (
  <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: ".18em", color, ...style }}>{children}</div>
);

type IconName =
  | "arrow" | "check" | "copy" | "link" | "file" | "briefcase" | "grid" | "skill" | "school"
  | "award" | "goal" | "mail" | "people" | "spark" | "eye" | "location" | "plus" | "x" | "up";
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size = 28, color = "currentColor", stroke = 2, style }) => {
  const shapes: Record<IconName, React.ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    up: <path d="M6 18 18 6M6 6h12v12" />,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" /></>,
    link: <path transform="translate(2 0) scale(.85)" d="m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 3 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" />,
    file: <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h6" />,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V4h8v3M3 12c5 4 13 4 18 0M12 12v5" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    skill: <path d="m12 3 9 5-9 5-9-5zm-9 9 9 5 9-5m-18 5 9 5 9-5" />,
    school: <path d="m2 8 10-5 10 5-10 5zM6 10v7c3 3 9 3 12 0v-7M22 8v8" />,
    award: <><circle cx="12" cy="8" r="5" /><path d="m8 12-2 9 6-3 6 3-2-9" /></>,
    goal: <><circle cx="11" cy="13" r="8" /><circle cx="11" cy="13" r="4" /><path d="m11 13 9-10m-5 1 5-1 1 5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 7 9-7" /></>,
    people: <><circle cx="9" cy="7" r="3" /><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 10v-3a5 5 0 0 0-3-4" /></>,
    spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}>
      {shapes[name]}
    </svg>
  );
};

// Mouse pointer that travels between points and "clicks" at `clickAt`.
export const Cursor: React.FC<{ path: { f: number; x: number; y: number }[]; clickAt?: number }> = ({ path, clickAt }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p.f);
  const opts = { ...clamp, easing: (t: number) => 1 - Math.pow(1 - t, 3) };
  const x = interpolate(frame, fs, path.map((p) => p.x), opts);
  const y = interpolate(frame, fs, path.map((p) => p.y), opts);
  const press = clickAt === undefined ? 0 : interpolate(frame, [clickAt - 3, clickAt, clickAt + 5], [0, 1, 0], clamp);
  const ring = clickAt === undefined ? 0 : interpolate(frame, [clickAt, clickAt + 16], [0, 1], clamp);
  const visible = interpolate(frame, [fs[0], fs[0] + 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible, zIndex: 50 }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: "absolute", left: -30 * ring - 4, top: -30 * ring - 4, width: 60 * ring + 8, height: 60 * ring + 8, borderRadius: "50%", border: `3px solid ${C.blue}`, opacity: 1 - ring }} />
      )}
      <svg width="44" height="44" viewBox="0 0 24 24" style={{ transform: `scale(${1 - press * 0.15})`, transformOrigin: "4px 4px", filter: "drop-shadow(0 6px 10px rgba(16,38,65,.3))" }}>
        <path d="M4 3l15 8-6.5 1.6L10 19z" fill={C.ink} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
