import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { dela, mincho } from "../fonts";
import beatsJson from "./beats.json";
import { COMMENTS, FACT, HOOK, LYRICS, Line, ROMPA_KEYS, SECTIONS, VOTES } from "./timeline";

const BEATS: number[] = beatsJson;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

const sinceBeat = (t: number) => {
  let last = -Infinity;
  for (const b of BEATS) {
    if (b > t) break;
    last = b;
  }
  return t - last;
};
const beatIndex = (t: number) => BEATS.filter((b) => b <= t).length - 1;
const pulse = (t: number, d = 0.22) => {
  const s = sinceBeat(t);
  return s < d ? 1 - s / d : 0;
};

type Theme = { bg: string; ink: string; soft: string; accent: string; card: string; label: string };
const CREAM = { ink: "#1E1B18", soft: "#6B6259", accent: "#D6452B", card: "#FFFDF8" };
const THEMES: Theme[] = [
  { bg: "#EFE9DD", ...CREAM, label: "KEY  Em" },
  { bg: "#F2D2BC", ...CREAM, label: "KEY  Fm  ↑" },
  { bg: "#16130F", ink: "#F4EEE2", soft: "#A59C90", accent: "#FF5A36", card: "#26211B", label: "KEY  F#m  ↑↑" },
  { bg: "#EFE9DD", ...CREAM, label: "KEY  Em  （元に戻った）" },
];
const keyIdx = (t: number) => (t >= SECTIONS.outro ? 3 : t >= SECTIONS.key2 ? 2 : t >= SECTIONS.key1 ? 1 : 0);

// ---------- Socrates ----------
const SocratesFig: React.FC<{ th: Theme; talk: number; size?: number }> = ({ th, talk, size = 320 }) => (
  <svg viewBox="0 0 300 380" style={{ width: size, height: (size * 380) / 300, overflow: "visible" }}>
    {/* toga */}
    <path d="M 60 380 Q 60 250 150 240 Q 240 250 240 380 Z" fill={th.card} stroke={th.ink} strokeWidth={6} />
    <path d="M 95 262 L 215 380" stroke={th.accent} strokeWidth={18} />
    {/* head */}
    <circle cx={150} cy={130} r={92} fill={th.card} stroke={th.ink} strokeWidth={6} />
    {/* side hair */}
    <path d="M 62 140 Q 58 100 78 82" fill="none" stroke={th.ink} strokeWidth={14} strokeLinecap="round" />
    <path d="M 238 140 Q 242 100 222 82" fill="none" stroke={th.ink} strokeWidth={14} strokeLinecap="round" />
    {/* brows + eyes */}
    <path d="M 100 108 Q 118 98 134 108" fill="none" stroke={th.ink} strokeWidth={7} strokeLinecap="round" />
    <path d="M 166 108 Q 182 98 200 108" fill="none" stroke={th.ink} strokeWidth={7} strokeLinecap="round" />
    <circle cx={118} cy={128} r={8} fill={th.ink} />
    <circle cx={182} cy={128} r={8} fill={th.ink} />
    {/* beard */}
    <path
      d="M 74 160 Q 70 250 110 280 Q 130 300 150 292 Q 170 300 190 280 Q 230 250 226 160 Q 200 196 150 196 Q 100 196 74 160 Z"
      fill={th.ink}
    />
    {/* mouth */}
    <ellipse cx={150} cy={214} rx={18} ry={4 + talk * 12} fill={th.accent} />
  </svg>
);

// ---------- Comment feed ----------
const Avatar: React.FC<{ th: Theme; i: number }> = ({ th, i }) => (
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: 999,
      background: ["#B9A68F", "#8C9AAE", "#A58CA3", "#9DAE8C"][i % 4],
      flexShrink: 0,
    }}
  />
);

const Feed: React.FC<{ t: number; th: Theme; burning: number }> = ({ t, th, burning }) => {
  const start = SECTIONS.chorus;
  const end = SECTIONS.key2;
  const every = 1.86; // one comment per bar
  const n = Math.max(0, Math.min(COMMENTS.length, Math.floor((t - start) / every) + 1));
  const items = COMMENTS.slice(0, n);
  const rowH = 168;
  const scroll = Math.max(0, items.length - 3) * rowH;
  const lastAt = start + (n - 1) * every;
  const replyIn = interpolate(t - lastAt, [0.45, 0.7], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 520,
        width: 840,
        height: 660,
        borderRadius: 48,
        border: `8px solid ${th.ink}`,
        background: th.card,
        overflow: "hidden",
        opacity: interpolate(t, [start - 0.6, start, end - 0.2, end + 0.4], [0, 1, 1, 0], clamp),
      }}
    >
      <div
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          borderBottom: `4px solid ${th.ink}`,
          fontSize: 38,
          color: th.ink,
          background: burning > 0 ? th.accent : th.card,
        }}
      >
        <span style={{ color: burning > 0 ? th.card : th.ink }}>コメント</span>
        {burning > 0 ? <span style={{ color: th.card, scale: String(1 + pulse(t) * 0.1) }}>炎上中</span> : null}
      </div>
      <div style={{ position: "absolute", top: 84, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
      <div style={{ translate: `0px ${-scroll}px`, padding: "18px 30px" }}>
        {items.map((c, i) => {
          const showReply = i < n - 1 || replyIn > 0;
          return (
            <div key={i} style={{ height: rowH }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <Avatar th={th} i={i} />
                <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 44, color: th.ink }}>{c}</div>
              </div>
              {showReply ? (
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    marginLeft: 84,
                    marginTop: 10,
                    opacity: i < n - 1 ? 1 : replyIn,
                  }}
                >
                  <div style={{ width: 48, height: 48, overflow: "hidden" }}>
                    <SocratesFig th={th} talk={0} size={48} />
                  </div>
                  <div style={{ fontSize: 40, color: th.accent }}>なぜ？</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      </div>
      {/* flames tint */}
      <AbsoluteFill style={{ background: th.accent, opacity: burning * 0.28, pointerEvents: "none" }} />
    </div>
  );
};

// ---------- Court ----------
const Court: React.FC<{ t: number; th: Theme }> = ({ t, th }) => {
  const g = Math.round(interpolate(t, [VOTES.start, VOTES.end], [0, VOTES.guilty], { ...clamp, easing: out }));
  const ng = Math.round(interpolate(t, [VOTES.start, VOTES.end], [0, VOTES.notGuilty], { ...clamp, easing: out }));
  const maxH = 420;
  const bar = (v: number, label: string, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 260 }}>
      <div style={{ fontSize: 96, color }}>{v}</div>
      <div style={{ width: 200, height: (v / VOTES.guilty) * maxH, background: color, borderRadius: 16 }} />
      <div style={{ fontSize: 52, color: th.ink, marginTop: 16 }}>{label}</div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 1080,
        top: 560,
        height: 700,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 260,
        opacity: interpolate(t, [SECTIONS.key2, SECTIONS.key2 + 0.6, SECTIONS.outro - 0.4, SECTIONS.outro], [0, 1, 1, 0], clamp),
      }}
    >
      {bar(g, "有罪", th.accent)}
      {bar(ng, "無罪", th.soft)}
    </div>
  );
};

// ---------- Lyrics ----------
const LyricView: React.FC<{ l: Line; t: number; th: Theme }> = ({ l, t, th }) => {
  const local = t - l.start;
  const dur = l.end - l.start;
  const lines = l.text.split("/");
  const base: React.CSSProperties = {
    position: "absolute",
    left: 80,
    right: 80,
    top: 1300,
    textAlign: "center",
    opacity: interpolate(local, [0, 0.08, dur - 0.1, dur], [0, 1, 1, 0], clamp),
    scale: interpolate(local, [0, 0.25], [1.18, 1], { ...clamp, easing: out }),
  };
  if (l.kind === "whisper")
    return (
      <div style={{ ...base, fontFamily: mincho, fontWeight: 700, fontSize: 76, lineHeight: 1.35, color: th.ink }}>
        {lines.map((x, i) => (
          <div key={i}>{x}</div>
        ))}
      </div>
    );
  if (l.kind === "crowd")
    return (
      <div style={{ ...base, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: dela,
            fontSize: 88,
            whiteSpace: "nowrap",
            color: th.accent,
            border: `8px solid ${th.accent}`,
            borderRadius: 28,
            padding: "16px 40px",
            rotate: "-3deg",
            scale: String(1 + pulse(t) * 0.06),
            background: th.bg,
          }}
        >
          {lines[0]}
        </div>
      </div>
    );
  return (
    <div style={{ ...base, fontFamily: dela, lineHeight: 1.25 }}>
      {lines.map((x, i) => {
        const hook = x.startsWith("ナゼ");
        return (
          <div
            key={i}
            style={{
              fontSize: hook ? 84 : 100,
              color: hook ? th.accent : th.ink,
              scale: hook ? String(1 + pulse(t) * 0.07) : "1",
            }}
          >
            {x}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Main ----------
export const Socrates: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = keyIdx(t);
  const th = THEMES[k];
  const keyStarts = [0, SECTIONS.key1, SECTIONS.key2, SECTIONS.outro];
  const sinceKey = t - keyStarts[k];
  const lyric = LYRICS.find((l) => t >= l.start && t < l.end);
  const rompa = Math.round(
    interpolate(t, ROMPA_KEYS.map((x) => x[0]), ROMPA_KEYS.map((x) => x[1]), clamp),
  );
  const burning = interpolate(t, [23.8, 24.2], [0, 1], clamp);
  const singing = t >= SECTIONS.chorus && t < SECTIONS.outro;
  const shake = singing ? pulse(t, 0.12) * 6 : 0;
  const talk = lyric && lyric.kind === "lead" ? pulse(t, 0.3) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: th.bg, fontFamily: dela, overflow: "hidden" }}>
      <Audio src={staticFile("socrates.mp3")} />

      <AbsoluteFill
        style={{ backgroundColor: th.accent, opacity: k === 0 ? 0 : interpolate(sinceKey, [0, 0.35], [0.55, 0], clamp) }}
      />

      {/* key badge */}
      {t >= SECTIONS.chorus ? (
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 80,
            fontSize: 36,
            color: k === 0 ? th.soft : th.accent,
            border: `4px solid ${k === 0 ? th.soft : th.accent}`,
            borderRadius: 999,
            padding: "8px 26px",
            scale: String(interpolate(sinceKey, [0, 0.5], [1.5, 1], { ...clamp, easing: out })),
            transformOrigin: "left center",
          }}
        >
          {th.label}
        </div>
      ) : null}

      {/* ---- top area ---- */}
      {t < SECTIONS.chorus ? (
        <div style={{ position: "absolute", top: 130, left: 80, right: 80, textAlign: "center", color: th.ink }}>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 54, opacity: interpolate(t, [0.2, 0.8], [0, 1], clamp) }}>
            {HOOK.small}
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.12,
              marginTop: 18,
              whiteSpace: "pre-line",
              opacity: interpolate(t, [0.9, 1.5], [0, 1], clamp),
              scale: interpolate(t, [0.9, 1.6], [1.15, 1], { ...clamp, easing: out }),
            }}
          >
            {HOOK.big}
          </div>
          <div
            style={{
              fontSize: 80,
              marginTop: 14,
              color: th.accent,
              opacity: interpolate(t, [2.4, 3.0], [0, 1], clamp),
              scale: String(interpolate(t, [2.4, 3.1], [1.25, 1], { ...clamp, easing: out }) + pulse(t) * 0.04),
            }}
          >
            {HOOK.question}
          </div>
        </div>
      ) : null}

      {t >= SECTIONS.chorus && t < SECTIONS.key2 ? (
        <div style={{ position: "absolute", top: 220, left: 80, right: 80, textAlign: "center", color: th.ink }}>
          <div style={{ fontSize: 70, color: th.soft }}>論破</div>
          <div style={{ fontSize: 190, lineHeight: 1, color: rompa >= 100 ? th.accent : th.ink }}>
            {rompa}
            <span style={{ fontSize: 80 }}>人</span>
          </div>
        </div>
      ) : null}

      {t >= SECTIONS.key2 && t < SECTIONS.outro ? (
        <div style={{ position: "absolute", top: 220, left: 80, right: 80, textAlign: "center" }}>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 52, color: th.soft }}>アテナイ市民 約500人の裁判</div>
          <div style={{ fontSize: 110, color: th.ink, marginTop: 10 }}>判決は？</div>
        </div>
      ) : null}

      {t >= SECTIONS.outro ? (
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 90,
            right: 90,
            fontFamily: mincho,
            fontSize: 44,
            lineHeight: 1.6,
            color: th.ink,
            opacity: interpolate(t, [SECTIONS.outro + 0.3, SECTIONS.outro + 1.2], [0, 1], clamp),
          }}
        >
          {FACT}
        </div>
      ) : null}

      {/* ---- stage ---- */}
      <div style={{ position: "absolute", inset: 0, translate: `0px ${shake}px` }}>
        {/* Intro: big Socrates */}
        {t < SECTIONS.chorus + 0.6 ? (
          <div
            style={{
              position: "absolute",
              left: 540 - 190,
              top: 640,
              opacity: interpolate(t, [0.3, 1.0, SECTIONS.chorus, SECTIONS.chorus + 0.6], [0, 1, 1, 0], clamp),
            }}
          >
            <SocratesFig th={th} talk={beatIndex(t) >= 0 ? pulse(t, 0.3) : 0} size={380} />
          </div>
        ) : null}

        <Feed t={t} th={th} burning={burning} />

        {/* Small Socrates next to the feed */}
        {singing && t < SECTIONS.key2 ? (
          <div style={{ position: "absolute", right: 30, top: 1050 }}>
            <SocratesFig th={th} talk={talk} size={170} />
          </div>
        ) : null}

        <Court t={t} th={th} />
        {t >= SECTIONS.key2 && t < SECTIONS.outro ? (
          <div style={{ position: "absolute", left: 540 - 80, top: 1040 }}>
            <SocratesFig th={th} talk={talk} size={160} />
          </div>
        ) : null}

        {/* Outro: たらればくん asks the viewer */}
        {t >= SECTIONS.outro ? (
          <Img
            src={staticFile("tarareba.png")}
            style={{
              position: "absolute",
              width: 560,
              left: 260,
              top: 640,
              opacity: interpolate(t, [SECTIONS.outro, SECTIONS.outro + 0.8], [0, 1], clamp),
              scale: String(1 + pulse(t, 0.3) * 0.02),
            }}
          />
        ) : null}
      </div>

      {lyric ? <LyricView key={lyric.start} l={lyric} t={t} th={th} /> : null}
    </AbsoluteFill>
  );
};
