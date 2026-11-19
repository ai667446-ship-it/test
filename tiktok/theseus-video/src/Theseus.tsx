import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { dela, mincho } from "./fonts";
import { FACT, HOOK, KEY_CAPTION, LYRICS, Lyric, PLANK_KEYS, SECTIONS, TOTAL_PLANKS } from "./timeline";
import { Theme, keyIndexAt, themeAt } from "./theme";
import { beatIndex, beatPulse } from "./beats";
import { PIECES, Ship } from "./Ship";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

const planksAt = (t: number) =>
  Math.round(
    interpolate(
      t,
      PLANK_KEYS.map((k) => k[0]),
      PLANK_KEYS.map((k) => k[1]),
      clamp,
    ),
  );

// ---------- Lyrics ----------
const LyricText: React.FC<{ lyric: Lyric; t: number; theme: Theme }> = ({ lyric, t, theme }) => {
  const local = t - lyric.start;
  const lines = lyric.text.split("/");
  const base: React.CSSProperties = {
    position: "absolute",
    left: 80,
    right: 80,
    top: 1290,
    textAlign: "center",
    opacity: interpolate(local, [0, 0.08, lyric.end - lyric.start - 0.1, lyric.end - lyric.start], [0, 1, 1, 0], clamp),
    scale: interpolate(local, [0, 0.25], [1.18, 1], { ...clamp, easing: out }),
  };

  if (lyric.kind === "whisper") {
    return (
      <div style={{ ...base, fontFamily: mincho, fontWeight: 700, fontSize: 76, lineHeight: 1.35, color: theme.ink }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              opacity: interpolate(local, [i * 0.9, i * 0.9 + 0.4], [0, 1], clamp),
            }}
          >
            {l}
          </div>
        ))}
      </div>
    );
  }

  if (lyric.kind === "crowd") {
    return (
      <div style={{ ...base, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: dela,
            fontSize: 80,
            whiteSpace: "nowrap",
            color: theme.accent,
            border: `8px solid ${theme.accent}`,
            borderRadius: 28,
            padding: "18px 40px",
            rotate: "-3deg",
            scale: String(1 + beatPulse(t) * 0.06),
            background: theme.bg,
          }}
        >
          {lines[0]}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...base, fontFamily: dela, lineHeight: 1.25 }}>
      {lines.map((l, i) => {
        const isHook = l.startsWith("トンカン") || l.startsWith("トン・カン");
        return (
          <div
            key={i}
            style={{
              fontSize: isHook ? 84 : 104,
              color: isHook ? theme.accent : theme.ink,
              scale: isHook ? String(1 + beatPulse(t) * 0.07) : "1",
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Crowd ----------
const Person: React.FC<{ x: number; theme: Theme; up: number; scale?: number }> = ({ x, theme, up, scale = 1 }) => {
  const arm = interpolate(up, [0, 1], [0, 1]);
  return (
    <g transform={`translate(${x} 190) scale(${scale})`}>
      <circle cx={0} cy={-120} r={22} fill={theme.ink} />
      <path d="M -28 0 Q -28 -88 0 -90 Q 28 -88 28 0 Z" fill={theme.ink} />
      <line x1={-20} y1={-70} x2={-38} y2={-70 - 60 * arm} stroke={theme.ink} strokeWidth={10} strokeLinecap="round" />
      <line x1={20} y1={-70} x2={38} y2={-70 - 60 * arm} stroke={theme.ink} strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};

const Crowd: React.FC<{ t: number; theme: Theme; cheering: boolean }> = ({ t, theme, cheering }) => {
  const xs = [140, 290, 440, 640, 790, 940];
  const bi = beatIndex(t);
  return (
    <svg viewBox="0 0 1080 200" style={{ position: "absolute", left: 0, top: 1060, width: 1080, height: 200 }}>
      {xs.map((x, i) => (
        <Person
          key={i}
          x={x}
          theme={theme}
          scale={0.8}
          up={cheering ? ((bi + i) % 2 === 0 ? 1 : 0.55) : 0}
        />
      ))}
    </svg>
  );
};

// ---------- Outro figure ----------
const Figure: React.FC<{ t: number; theme: Theme }> = ({ t, theme }) => {
  const segs = 6;
  const n = Math.max(0, beatIndex(t) - beatIndex(SECTIONS.outro + 0.3));
  return (
    <svg viewBox="0 0 400 600" style={{ width: 400, height: 600 }}>
      <circle cx={200} cy={90} r={62} fill={n % 2 === 0 ? theme.ink : theme.accent} />
      {Array.from({ length: segs }).map((_, i) => {
        const y = 170 + i * 62;
        const w = 150 - Math.abs(i - 1.5) * 8;
        const isNew = (i + n) % segs < Math.min(n, segs);
        return (
          <rect
            key={i}
            x={200 - w / 2}
            y={y}
            width={w}
            height={56}
            rx={14}
            fill={isNew ? theme.accent : theme.ink}
          />
        );
      })}
    </svg>
  );
};

// ---------- Main ----------
export const Theseus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const theme = themeAt(t);
  const keyIdx = keyIndexAt(t);

  const planks = planksAt(t);
  const pieces = planks === 0 ? 0 : Math.min(PIECES, Math.ceil(planks / (TOTAL_PLANKS / PIECES)));
  const singing = t >= SECTIONS.chorus1 && t < SECTIONS.outro;
  const shake = singing ? beatPulse(t, 0.12) * 6 : 0;
  const lyric = LYRICS.find((l) => t >= l.start && t < l.end);
  const cheering = lyric?.kind === "crowd";

  // Two-ship phase
  const twoShips = interpolate(t, [SECTIONS.key3, SECTIONS.key3 + 1.2], [0, 1], { ...clamp, easing: out });
  const shipsOut = interpolate(t, [SECTIONS.outro, SECTIONS.outro + 0.8], [1, 0], clamp);

  // Key-change badge pop
  const keyStarts = [0, SECTIONS.key1, SECTIONS.key2, SECTIONS.key3, SECTIONS.outro];
  const sinceKey = t - keyStarts[keyIdx];
  const keyPop = interpolate(sinceKey, [0, 0.5], [1.5, 1], { ...clamp, easing: out });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: dela, overflow: "hidden" }}>
      <Audio src={staticFile("song.mp3")} />

      {/* Flash on key change */}
      <AbsoluteFill
        style={{
          backgroundColor: theme.accent,
          opacity: keyIdx === 0 ? 0 : interpolate(sinceKey, [0, 0.35], [0.55, 0], clamp),
        }}
      />

      {/* Key badge */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 80,
          fontSize: 36,
          color: keyIdx === 0 ? theme.soft : theme.accent,
          border: `4px solid ${keyIdx === 0 ? theme.soft : theme.accent}`,
          borderRadius: 999,
          padding: "8px 26px",
          scale: String(keyPop),
          transformOrigin: "left center",
          opacity: t < SECTIONS.chorus1 ? 0 : 1,
        }}
      >
        {theme.keyLabel}
      </div>

      {/* ---- Top area ---- */}
      {t < SECTIONS.chorus1 ? (
        <div style={{ position: "absolute", top: 170, left: 80, right: 80, textAlign: "center", color: theme.ink }}>
          <div
            style={{
              fontFamily: mincho,
              fontWeight: 700,
              fontSize: 60,
              opacity: interpolate(t, [0.2, 0.8], [0, 1], clamp),
            }}
          >
            {HOOK.small}
          </div>
          <div
            style={{
              fontSize: 112,
              lineHeight: 1.15,
              marginTop: 18,
              whiteSpace: "pre-line",
              opacity: interpolate(t, [0.9, 1.5], [0, 1], clamp),
              scale: interpolate(t, [0.9, 1.6], [1.15, 1], { ...clamp, easing: out }),
            }}
          >
            {HOOK.big}
          </div>
        </div>
      ) : null}

      {t >= SECTIONS.chorus1 && t < SECTIONS.key3 ? (
        <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center", color: theme.ink }}>
          <div style={{ fontSize: 180, lineHeight: 1, color: planks >= TOTAL_PLANKS ? theme.accent : theme.ink }}>
            {planks}
            <span style={{ fontSize: 80 }}>日目</span>
          </div>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 48, color: theme.soft, marginTop: 14 }}>
            交換した板 {planks} / {TOTAL_PLANKS} 枚
          </div>
        </div>
      ) : null}

      {t >= SECTIONS.key3 && t < SECTIONS.outro ? (
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 80,
            right: 80,
            textAlign: "center",
            fontFamily: mincho,
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.4,
            whiteSpace: "pre-line",
            color: theme.ink,
            opacity: interpolate(t, [SECTIONS.key3 + 0.3, SECTIONS.key3 + 1, SECTIONS.key3 + 6.5, SECTIONS.key3 + 7.2], [0, 1, 1, 0], clamp),
          }}
        >
          {KEY_CAPTION}
        </div>
      ) : null}

      {t >= SECTIONS.key3 + 7.2 && t < SECTIONS.outro ? (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 120,
            color: theme.accent,
            opacity: interpolate(t, [SECTIONS.key3 + 7.2, SECTIONS.key3 + 7.6], [0, 1], clamp),
            scale: String(1 + beatPulse(t) * 0.08),
          }}
        >
          本物はどっち？
        </div>
      ) : null}

      {t >= SECTIONS.outro ? (
        <div
          style={{
            position: "absolute",
            top: 210,
            left: 90,
            right: 90,
            fontFamily: mincho,
            fontSize: 44,
            lineHeight: 1.6,
            color: theme.ink,
            opacity: interpolate(t, [SECTIONS.outro + 0.5, SECTIONS.outro + 1.5], [0, 1], clamp),
          }}
        >
          {FACT}
        </div>
      ) : null}

      {/* ---- Stage ---- */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, translate: `0px ${shake}px` }}>
        {/* Main (new) ship */}
        <div
          style={{
            position: "absolute",
            left: 140,
            width: 800,
            height: 420,
            top: interpolate(twoShips, [0, 1], [560, 600]),
            scale: String(interpolate(twoShips, [0, 1], [1, 0.55])),
            translate: `${interpolate(twoShips, [0, 1], [0, -250])}px 0px`,
            opacity: shipsOut,
          }}
        >
          <Ship
            theme={theme}
            replaced={pieces}
            flash={t >= SECTIONS.chorus1 && t < 38 ? beatPulse(t, 0.3) : 0}
            label={twoShips > 0.5 ? "新しい板の船" : undefined}
          />
        </div>

        {/* Rebuilt ship from discarded planks */}
        {t >= SECTIONS.key3 ? (
          <div
            style={{
              position: "absolute",
              left: 140,
              width: 800,
              height: 420,
              top: 600,
              scale: "0.55",
              translate: `${interpolate(twoShips, [0, 1], [900, 250])}px 0px`,
              opacity: shipsOut,
            }}
          >
            <Ship theme={theme} replaced={0} allOld flash={0} label="捨てた板の船" />
          </div>
        ) : null}

        {/* Sea */}
        <svg
          viewBox="0 0 1080 120"
          style={{ position: "absolute", left: 0, top: 930, width: 1080, height: 120, opacity: shipsOut }}
        >
          {[0, 1].map((row) => {
            const phase = t * (row ? 1.6 : 2.4);
            const pts = Array.from({ length: 28 }, (_, i) => {
              const x = i * 40;
              const y = 40 + row * 40 + Math.sin(i * 0.9 + phase) * 10;
              return `${x},${y}`;
            }).join(" ");
            return (
              <polyline
                key={row}
                points={pts}
                fill="none"
                stroke={row ? theme.soft : theme.ink}
                strokeWidth={5}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Crowd */}
        {singing && lyric?.kind !== "whisper" ? <Crowd t={t} theme={theme} cheering={cheering} /> : null}

        {/* Outro figure */}
        {t >= SECTIONS.outro ? (
          <div
            style={{
              position: "absolute",
              left: 340,
              top: 660,
              opacity: interpolate(t, [SECTIONS.outro + 0.3, SECTIONS.outro + 1.2], [0, 1], clamp),
            }}
          >
            <Figure t={t} theme={theme} />
          </div>
        ) : null}
      </div>

      {/* Hook question (lyric area) during the intro */}
      {t < SECTIONS.chorus1 ? (
        <div
          style={{
            position: "absolute",
            top: 1300,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 96,
            color: theme.accent,
            opacity: interpolate(t, [2.4, 3.0], [0, 1], clamp),
            scale: String(interpolate(t, [2.4, 3.1], [1.25, 1], { ...clamp, easing: out }) + beatPulse(t) * 0.05),
          }}
        >
          {HOOK.question}
        </div>
      ) : null}

      {lyric ? <LyricText key={lyric.start} lyric={lyric} t={t} theme={theme} /> : null}
    </AbsoluteFill>
  );
};
