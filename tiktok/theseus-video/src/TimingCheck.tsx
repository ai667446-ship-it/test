import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { dela, mincho } from "./fonts";
import { LYRICS } from "./timeline";

// Helper video: big running clock + the lyric currently assigned in timeline.ts,
// so lyric start times can be noted while listening.
export const TimingCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = LYRICS.findIndex((l) => t >= l.start && t < l.end);
  const cur = idx >= 0 ? LYRICS[idx] : null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#16130F", color: "#F4EEE2", alignItems: "center", fontFamily: dela }}>
      <Audio src={staticFile("song.mp3")} />
      <div style={{ marginTop: 300, fontSize: 300, fontVariantNumeric: "tabular-nums" }}>{t.toFixed(1)}</div>
      <div style={{ fontSize: 60, color: "#A59C90" }}>秒</div>
      <div style={{ marginTop: 160, fontFamily: mincho, fontSize: 44, color: "#A59C90" }}>今の字幕（{idx >= 0 ? `#${idx + 1}` : "なし"}）</div>
      <div style={{ marginTop: 20, fontSize: 72, textAlign: "center", padding: "0 80px", color: "#FF5A36" }}>
        {cur ? cur.text.replace("/", " ") : "—"}
      </div>
    </AbsoluteFill>
  );
};
