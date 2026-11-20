import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { dela } from "../fonts";

// Timing helper: black background + big running clock, with the lower half left
// empty so captions can be added on top in CapCut.
export const SunkTiming: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#16130F", color: "#F4EEE2", alignItems: "center", fontFamily: dela }}>
      <Audio src={staticFile("sunkcost.mp3")} />
      <div style={{ marginTop: 260, fontSize: 280, fontVariantNumeric: "tabular-nums" }}>{t.toFixed(1)}</div>
      <div style={{ fontSize: 60, color: "#A59C90" }}>秒</div>
    </AbsoluteFill>
  );
};
