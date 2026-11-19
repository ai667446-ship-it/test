import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { dela, mincho } from "../fonts";
import beatsJson from "./beats.json";
import { EXPLAIN, FACT, HOOK, LYRICS, Line, MONEY_KEYS, SECTIONS, TAKEAWAY } from "./timeline";

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
const pulse = (t: number, d = 0.22) => {
  const s = sinceBeat(t);
  return s < d ? 1 - s / d : 0;
};

type Theme = { bg: string; ink: string; soft: string; accent: string; card: string; label: string };
const CREAM = { ink: "#1E1B18", soft: "#6B6259", accent: "#D6452B", card: "#FFFDF8" };
const THEMES: Theme[] = [
  { bg: "#EFE9DD", ...CREAM, label: "KEY  G" },
  { bg: "#F2D2BC", ...CREAM, label: "KEY  A♭  ↑" },
  { bg: "#16130F", ink: "#F4EEE2", soft: "#A59C90", accent: "#FF5A36", card: "#26211B", label: "KEY  A  ↑↑" },
  { bg: "#EFE9DD", ...CREAM, label: "KEY  G  （元に戻った）" },
];
const keyIdx = (t: number) => (t >= SECTIONS.outro ? 3 : t >= SECTIONS.key2 ? 2 : t >= SECTIONS.key1 ? 1 : 0);
const yen = (n: number) => "¥" + n.toLocaleString("ja-JP");

// ---------- Phone with gacha button ----------
const Phone: React.FC<{ t: number; th: Theme; stopped: number }> = ({ t, th, stopped }) => {
  const money = Math.round(interpolate(t, MONEY_KEYS.map((k) => k[0]), MONEY_KEYS.map((k) => k[1]), clamp));
  const press = stopped > 0 ? 0 : pulse(t, 0.18);
  const show = interpolate(
    t,
    [SECTIONS.chorus - 0.5, SECTIONS.chorus, SECTIONS.key1 - 0.2, SECTIONS.key1 + 0.3, SECTIONS.key2 - 0.3, SECTIONS.key2, SECTIONS.outro - 0.3, SECTIONS.outro],
    [0, 1, 1, 0, 0, 1, 1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 300,
        top: 470,
        width: 480,
        height: 760,
        borderRadius: 64,
        border: `10px solid ${th.ink}`,
        background: th.card,
        opacity: show,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginTop: 60, fontSize: 40, color: th.soft }}>課金額</div>
      <div style={{ fontSize: 96, color: money >= 10000 ? th.accent : th.ink, scale: String(1 + press * 0.05) }}>
        {yen(money)}
      </div>
      {/* gacha capsule (oval, two halves) */}
      <svg viewBox="0 0 200 240" style={{ width: 190, height: 228, marginTop: 20, rotate: `${-18 + press * 14}deg` }}>
        <path d="M 30 120 L 30 90 A 70 70 0 0 1 170 90 L 170 120 Z" fill={th.accent} stroke={th.ink} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 30 120 L 30 150 A 70 70 0 0 0 170 150 L 170 120 Z" fill={th.card} stroke={th.ink} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 60 70 Q 75 50 100 46" fill="none" stroke={th.card} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      </svg>
      {/* button */}
      <div
        style={{
          marginTop: 40,
          width: 320,
          height: 120,
          borderRadius: 999,
          background: stopped > 0 ? th.soft : th.accent,
          color: th.card,
          fontSize: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          translate: `0px ${press * 10}px`,
          boxShadow: `0 ${14 - press * 10}px 0 ${th.ink}`,
        }}
      >
        {stopped > 0 ? "やーめた" : "回す"}
      </div>
      {stopped > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: 64,
            border: `14px solid ${th.accent}`,
            opacity: stopped,
          }}
        />
      ) : null}
    </div>
  );
};

// ---------- Concorde ----------
const Concorde: React.FC<{ t: number; th: Theme }> = ({ t, th }) => {
  const a = SECTIONS.key1;
  const b = SECTIONS.breakStart;
  const show = interpolate(t, [a, a + 0.4, b - 0.3, b], [0, 1, 1, 0], clamp);
  const loss = interpolate(t, [a + 0.3, b - 0.4], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 0, top: 470, width: 1080, height: 760, opacity: show }}>
      <svg viewBox="0 0 900 300" style={{ position: "absolute", left: 90, top: 60, width: 900, height: 300, translate: `${interpolate(t, [a, b], [-40, 40])}px 0px` }}>
        {/* fuselage */}
        <path d="M 40 160 Q 60 150 120 148 L 760 140 Q 840 140 880 160 Q 840 166 760 168 L 120 172 Q 60 172 40 160 Z" fill={th.card} stroke={th.ink} strokeWidth={6} />
        {/* delta wing */}
        <path d="M 330 168 L 640 168 L 700 240 L 420 240 Z" fill={th.card} stroke={th.ink} strokeWidth={6} strokeLinejoin="round" />
        {/* tail */}
        <path d="M 90 150 L 60 60 L 120 60 L 170 150 Z" fill={th.card} stroke={th.ink} strokeWidth={6} strokeLinejoin="round" />
        {/* windows */}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={240 + i * 34} cy={156} r={5} fill={th.ink} />
        ))}
        <line x1={150} y1={164} x2={820} y2={156} stroke={th.accent} strokeWidth={5} />
      </svg>
      {/* loss meter */}
      <div style={{ position: "absolute", left: 160, top: 420, width: 760 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 48, color: th.ink }}>
          <span>赤字</span>
          <span style={{ color: th.accent }}>{loss > 0.95 ? "それでも続行" : ""}</span>
        </div>
        <div style={{ marginTop: 14, height: 60, borderRadius: 999, border: `6px solid ${th.ink}`, overflow: "hidden" }}>
          <div style={{ width: `${loss * 100}%`, height: "100%", background: th.accent }} />
        </div>
      </div>
    </div>
  );
};

// ---------- Explanation card (break) ----------
const Explain: React.FC<{ t: number; th: Theme }> = ({ t, th }) => {
  const a = SECTIONS.breakStart;
  const b = SECTIONS.key2;
  const show = interpolate(t, [a, a + 0.5, b - 0.4, b], [0, 1, 1, 0], clamp);
  const step = (s: number) => interpolate(t, [a + s, a + s + 0.5], [0, 1], { ...clamp, easing: out });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 430, textAlign: "center", color: th.ink, opacity: show }}>
      <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 52, color: th.soft, opacity: step(0) }}>このクセの名前は</div>
      <div style={{ fontSize: 150, color: th.accent, lineHeight: 1.1, marginTop: 16, opacity: step(0.8), scale: String(interpolate(step(0.8), [0, 1], [1.2, 1])) }}>
        {EXPLAIN.title}
      </div>
      <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 56, opacity: step(0.8) }}>{EXPLAIN.sub}</div>
      <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 60, lineHeight: 1.45, marginTop: 50, whiteSpace: "pre-line", opacity: step(2.2) }}>
        {EXPLAIN.body}
      </div>
      <div
        style={{
          marginTop: 50,
          fontFamily: mincho,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          color: th.card,
          background: th.accent,
          borderRadius: 24,
          padding: "22px 30px",
          opacity: step(4.5),
        }}
      >
        {EXPLAIN.note}
      </div>
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
    opacity: interpolate(local, [0, 0.06, dur - 0.08, dur], [0, 1, 1, 0], clamp),
    scale: interpolate(local, [0, 0.22], [1.18, 1], { ...clamp, easing: out }),
  };
  if (l.kind === "crowd")
    return (
      <div style={{ ...base, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: dela,
            fontSize: 92,
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
        const hook = /^(ポチ|ズル)/.test(x);
        return (
          <div key={i} style={{ fontSize: hook ? 84 : 104, color: hook ? th.accent : th.ink, scale: hook ? String(1 + pulse(t) * 0.07) : "1" }}>
            {x}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Main ----------
export const SunkCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = keyIdx(t);
  const th = THEMES[k];
  const keyStarts = [0, SECTIONS.key1, SECTIONS.key2, SECTIONS.outro];
  const sinceKey = t - keyStarts[k];
  const lyric = LYRICS.find((l) => t >= l.start && t < l.end);
  const singing = t >= SECTIONS.chorus && t < SECTIONS.outro && !(t >= SECTIONS.breakStart && t < SECTIONS.key2);
  const shake = singing ? pulse(t, 0.12) * 6 : 0;
  const stopped = interpolate(t, [SECTIONS.key2, SECTIONS.key2 + 0.3], [0, 1], clamp);
  const money = Math.round(interpolate(t, MONEY_KEYS.map((x) => x[0]), MONEY_KEYS.map((x) => x[1]), clamp));

  return (
    <AbsoluteFill style={{ backgroundColor: th.bg, fontFamily: dela, overflow: "hidden" }}>
      <Audio src={staticFile("sunkcost.mp3")} />
      <AbsoluteFill style={{ backgroundColor: th.accent, opacity: k === 0 ? 0 : interpolate(sinceKey, [0, 0.35], [0.55, 0], clamp) }} />

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
        <div style={{ position: "absolute", top: 160, left: 80, right: 80, textAlign: "center", color: th.ink }}>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 60, opacity: interpolate(t, [0.2, 0.7], [0, 1], clamp) }}>
            {HOOK.small}
          </div>
          <div
            style={{
              fontSize: 110,
              lineHeight: 1.12,
              marginTop: 16,
              whiteSpace: "pre-line",
              opacity: interpolate(t, [0.6, 1.1], [0, 1], clamp),
              scale: interpolate(t, [0.6, 1.2], [1.15, 1], { ...clamp, easing: out }),
            }}
          >
            {HOOK.big}
          </div>
          <div
            style={{
              fontSize: 80,
              marginTop: 24,
              color: th.accent,
              opacity: interpolate(t, [2.6, 3.1], [0, 1], clamp),
              scale: String(interpolate(t, [2.6, 3.2], [1.25, 1], { ...clamp, easing: out }) + pulse(t) * 0.04),
            }}
          >
            {HOOK.question}
          </div>
        </div>
      ) : null}

      {t >= SECTIONS.chorus && t < SECTIONS.key1 ? (
        <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center", fontFamily: mincho, fontWeight: 700, fontSize: 60, color: th.ink }}>
          ガチャ、ここまで回したら
          <br />
          <span style={{ color: th.accent }}>やめられない…</span>
        </div>
      ) : null}

      {t >= SECTIONS.key1 && t < SECTIONS.breakStart ? (
        <div style={{ position: "absolute", top: 220, left: 80, right: 80, textAlign: "center", color: th.ink }}>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 50, lineHeight: 1.4 }}>
            赤字と分かっていても
            <br />
            開発をやめられなかった旅客機
          </div>
          <div style={{ fontSize: 76, color: th.accent, marginTop: 10 }}>コンコルド</div>
        </div>
      ) : null}

      {t >= SECTIONS.key2 && t < SECTIONS.outro ? (
        <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center", color: th.ink }}>
          <div style={{ fontFamily: mincho, fontWeight: 700, fontSize: 52, color: th.soft }}>使った {yen(money)} は</div>
          <div style={{ fontSize: 100, color: th.accent, marginTop: 6 }}>もう戻らない</div>
        </div>
      ) : null}

      {t >= SECTIONS.outro ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 200,
              left: 80,
              right: 80,
              textAlign: "center",
              fontSize: 80,
              lineHeight: 1.3,
              whiteSpace: "pre-line",
              color: th.ink,
              opacity: interpolate(t, [SECTIONS.outro + 0.2, SECTIONS.outro + 0.8], [0, 1], clamp),
            }}
          >
            {TAKEAWAY}
          </div>
          <div
            style={{
              position: "absolute",
              top: 1500,
              left: 90,
              right: 90,
              fontFamily: mincho,
              fontSize: 38,
              lineHeight: 1.6,
              color: th.soft,
              opacity: interpolate(t, [55.6, 56.4], [0, 1], clamp),
            }}
          >
            {FACT}
          </div>
        </>
      ) : null}

      {/* ---- stage ---- */}
      <div style={{ position: "absolute", inset: 0, translate: `0px ${shake}px` }}>
        {t < SECTIONS.chorus + 0.5 ? (
          <Img
            src={staticFile("tarareba.png")}
            style={{
              position: "absolute",
              width: 560,
              left: 260,
              top: 700,
              opacity: interpolate(t, [0.2, 0.8, SECTIONS.chorus, SECTIONS.chorus + 0.5], [0, 1, 1, 0], clamp),
            }}
          />
        ) : null}
        <Phone t={t} th={th} stopped={stopped} />
        <Concorde t={t} th={th} />
        <Explain t={t} th={th} />
        {t >= SECTIONS.outro ? (
          <Img
            src={staticFile("tarareba.png")}
            style={{
              position: "absolute",
              width: 520,
              left: 280,
              top: 620,
              opacity: interpolate(t, [SECTIONS.outro, SECTIONS.outro + 0.6], [0, 1], clamp),
              scale: String(1 + pulse(t, 0.3) * 0.02),
            }}
          />
        ) : null}
      </div>

      {lyric ? <LyricView key={lyric.start} l={lyric} t={t} th={th} /> : null}
    </AbsoluteFill>
  );
};
