import { SECTIONS } from "./timeline";

export type Theme = {
  bg: string;
  ink: string;
  soft: string;
  accent: string;
  oldWood: string;
  keyLabel: string;
};

const CREAM = { ink: "#1E1B18", soft: "#6B6259", accent: "#D6452B", oldWood: "#A39684" };

// One look per key. Each key change hard-cuts to the next look.
const THEMES: Theme[] = [
  { bg: "#EFE9DD", ...CREAM, keyLabel: "KEY  F#m" },
  { bg: "#F3E2D0", ...CREAM, keyLabel: "KEY  Gm  ↑" },
  { bg: "#F2D2BC", ...CREAM, keyLabel: "KEY  G#m  ↑↑" },
  {
    bg: "#16130F",
    ink: "#F4EEE2",
    soft: "#A59C90",
    accent: "#FF5A36",
    oldWood: "#6E655A",
    keyLabel: "KEY  Am  ↑↑↑",
  },
  { bg: "#EFE9DD", ...CREAM, keyLabel: "KEY  F#m  （元に戻った）" },
];

export const keyIndexAt = (t: number) => {
  if (t >= SECTIONS.outro) return 4;
  if (t >= SECTIONS.key3) return 3;
  if (t >= SECTIONS.key2) return 2;
  if (t >= SECTIONS.key1) return 1;
  return 0;
};

export const themeAt = (t: number): Theme => THEMES[keyIndexAt(t)];
