import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS, LaunchVideo } from "./LaunchVideo";

export const RemotionRoot: React.FC = () => (
  <Composition id="LaunchVideo" component={LaunchVideo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
);
