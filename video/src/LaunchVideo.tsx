import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./scenes/Intro";
import { Problem } from "./scenes/Problem";
import { Identity } from "./scenes/Identity";
import { Different } from "./scenes/Different";
import { HowItWorks } from "./scenes/HowItWorks";
import { Outro } from "./scenes/Outro";

export const FPS = 30;
const TRANSITION = 12;
const SCENES = [
  { id: "intro", Component: Intro, frames: 110 },
  { id: "problem", Component: Problem, frames: 160 },
  { id: "identity", Component: Identity, frames: 160 },
  { id: "different", Component: Different, frames: 310 },
  { id: "how", Component: HowItWorks, frames: 100 },
  { id: "outro", Component: Outro, frames: 120 },
];

// 960 frames of scenes minus 5 x 12-frame crossfades = 900 frames = 30 seconds.
export const DURATION = SCENES.reduce((sum, s) => sum + s.frames, 0) - TRANSITION * (SCENES.length - 1);

// Chapter start times (seconds) — the website player uses the same marks.
export const CHAPTERS = SCENES.map((scene, i) => ({
  id: scene.id,
  start: (SCENES.slice(0, i).reduce((sum, s) => sum + s.frames, 0) - TRANSITION * i) / FPS,
}));

export const LaunchVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, Component, frames }, i) => [
        ...(i > 0 ? [<TransitionSeries.Transition key={`${id}-in`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />] : []),
        <TransitionSeries.Sequence key={id} durationInFrames={frames}>
          <Component />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
  </AbsoluteFill>
);
