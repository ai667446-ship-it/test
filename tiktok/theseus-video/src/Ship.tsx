import React from "react";
import { Theme } from "./theme";

const ROWS = 3;
const COLS = 10;
export const PIECES = ROWS * COLS; // each piece stands for 10 of the 300 planks

// Deterministic shuffled replacement order
const ORDER: number[] = (() => {
  const a = Array.from({ length: PIECES }, (_, i) => i);
  let seed = 7;
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
})();

type Props = {
  theme: Theme;
  replaced: number; // 0..PIECES pieces shown as new
  allOld?: boolean; // the ship rebuilt from discarded planks
  flash: number; // 0..1, flash on the most recently replaced piece
  label?: string;
};

export const Ship: React.FC<Props> = ({ theme, replaced, allOld, flash, label }) => {
  const newSet = new Set(ORDER.slice(0, Math.floor(replaced)));
  const lastNew = replaced >= 1 ? ORDER[Math.floor(replaced) - 1] : -1;
  const pieces: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    const y = 250 + r * 44;
    const x0 = 70 + r * 34;
    const x1 = 730 - r * 34;
    const nx0 = 70 + (r + 1) * 34;
    const nx1 = 730 - (r + 1) * 34;
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const ax = x0 + ((x1 - x0) * c) / COLS;
      const bx = x0 + ((x1 - x0) * (c + 1)) / COLS;
      const cx = nx0 + ((nx1 - nx0) * (c + 1)) / COLS;
      const dx = nx0 + ((nx1 - nx0) * c) / COLS;
      const isNew = !allOld && newSet.has(idx);
      pieces.push(
        <polygon
          key={idx}
          points={`${ax},${y} ${bx},${y} ${cx},${y + 44} ${dx},${y + 44}`}
          fill={isNew ? theme.accent : theme.oldWood}
          stroke={theme.ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />,
      );
      if (idx === lastNew && flash > 0 && !allOld) {
        pieces.push(
          <polygon
            key={`f${idx}`}
            points={`${ax},${y} ${bx},${y} ${cx},${y + 44} ${dx},${y + 44}`}
            fill="#FFFFFF"
            opacity={flash * 0.85}
          />,
        );
      }
    }
  }

  return (
    <svg viewBox="0 0 800 420" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {/* mast and sail */}
      <line x1={400} y1={40} x2={400} y2={250} stroke={theme.ink} strokeWidth={8} strokeLinecap="round" />
      <path
        d="M 260 70 Q 400 50 540 70 L 520 220 Q 400 205 280 220 Z"
        fill={allOld ? theme.oldWood : theme.bg}
        stroke={theme.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <text
        x={400}
        y={160}
        textAnchor="middle"
        fontSize={52}
        fontWeight={700}
        fill={theme.ink}
        style={{ fontFamily: "inherit" }}
      >
        Θ
      </text>
      {/* bow and stern */}
      <path d="M 70 250 Q 30 220 40 180" fill="none" stroke={theme.ink} strokeWidth={6} strokeLinecap="round" />
      <path d="M 730 250 Q 770 220 760 180" fill="none" stroke={theme.ink} strokeWidth={6} strokeLinecap="round" />
      {pieces}
      {label ? (
        <text x={400} y={10} textAnchor="middle" fontSize={56} fill={theme.soft} style={{ fontFamily: "inherit" }}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};
