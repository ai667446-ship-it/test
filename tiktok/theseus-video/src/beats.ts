import beats from "./beats.json";

export const BEATS: number[] = beats;

// Seconds since the most recent beat (Infinity before the first beat)
export const sinceBeat = (t: number) => {
  let last = -Infinity;
  for (const b of BEATS) {
    if (b > t) break;
    last = b;
  }
  return t - last;
};

export const beatIndex = (t: number) => {
  let i = -1;
  for (const b of BEATS) {
    if (b > t) break;
    i++;
  }
  return i;
};

// 1 on the beat, decaying to 0 over `decay` seconds
export const beatPulse = (t: number, decay = 0.22) => {
  const s = sinceBeat(t);
  return s < decay ? 1 - s / decay : 0;
};
