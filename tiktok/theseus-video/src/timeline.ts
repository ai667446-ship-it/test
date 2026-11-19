// All times are in seconds, measured against public/song.mp3 (theseus_modA.mp3).
// Adjust these numbers to re-sync lyrics with the song.

export const SONG_DURATION = 71.95;

// Section boundaries (where the key changes in the edited song)
export const SECTIONS = {
  intro: 0,
  chorus1: 15.17, // chorus starts (counter appears)
  key1: 15.4, // +1 semitone
  key2: 31.26, // +2 semitones
  key3: 44.85, // +3 semitones (final chorus)
  outro: 62.92, // back to original key
  outroScene: 55.73, // ships fade, figure appears
};

export type LyricKind = "lead" | "crowd" | "whisper";

export type Lyric = {
  start: number;
  end: number;
  text: string; // "/" = line break
  kind: LyricKind;
  lineTimes?: number[]; // optional per-line reveal times
};

export const LYRICS: Lyric[] = [
  // Times taken frame-accurately from the user's own captioned edit (CapCut)
  // Intro chant
  { start: 0.0, end: 4.2, text: "トンカン トンカン", kind: "lead" },
  { start: 4.2, end: 8.1, text: "トンカン トンカン", kind: "lead" },
  { start: 8.17, end: 11.17, text: "トンカン トンカン/トンカン トンカン", kind: "lead" },
  // Chorus
  { start: 15.17, end: 17.1, text: "トンカン トンカン/1枚 変えて", kind: "lead" },
  { start: 17.1, end: 18.93, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 18.93, end: 22.7, text: "おなじ？ おなじ？", kind: "crowd" },
  { start: 22.7, end: 24.43, text: "トンカン トンカン/2枚 変えて", kind: "lead" },
  { start: 24.43, end: 26.33, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 26.33, end: 30.07, text: "おなじ？ おなじ？", kind: "crowd" },
  // Verse
  { start: 30.07, end: 31.03, text: "100枚/かえたら？", kind: "lead" },
  { start: 31.03, end: 31.77, text: "おなじ？", kind: "crowd" },
  { start: 31.77, end: 32.8, text: "200枚/かえたら？", kind: "lead" },
  { start: 32.8, end: 33.53, text: "おなじ？", kind: "crowd" },
  { start: 33.53, end: 37.73, text: "300枚/全部 変えたら？", kind: "lead" },
  // Break (instrumental)
  { start: 38.0, end: 44.6, text: "これって まだ/テセウスの船？", kind: "whisper" },
  // Final chorus
  { start: 44.77, end: 46.6, text: "トンカン トンカン/捨てた 板で", kind: "lead" },
  { start: 46.6, end: 48.43, text: "トンカン トンカン/もう いっせき", kind: "lead" },
  { start: 48.47, end: 50.07, text: "どっち？ どっち？", kind: "crowd" },
  { start: 50.07, end: 52.07, text: "トンカン トンカン/本物 どっち？", kind: "lead" },
  { start: 52.1, end: 55.73, text: "トンカン トンカン/わからん わからん", kind: "lead" },
  // Outro
  { start: 55.73, end: 62.1, text: "きのうの きみと/きょうの きみ", kind: "whisper" },
  { start: 62.1, end: 63.0, text: "まだ おなじ？", kind: "whisper" },
  { start: 63.0, end: 64.07, text: "トンカン", kind: "lead" },
  { start: 70.33, end: 71.23, text: "トンカン", kind: "lead" },
];

// Plank counter keyframes: [time, planks replaced] (out of 300)
export const PLANK_KEYS: [number, number][] = [
  [15.1, 0],
  [15.17, 1],
  [22.6, 1],
  [22.7, 2],
  [29.97, 2],
  [30.07, 100],
  [31.67, 100],
  [31.77, 200],
  [33.43, 200],
  [33.53, 300],
];
export const TOTAL_PLANKS = 300;

export const HOOK = {
  small: "もしもテセウスの船を",
  big: "1日1枚ずつ\n交換したら",
  question: "何日目から別の船？",
};

export const KEY_CAPTION = "この歌も もう\n全部の音の高さが 最初と違う";

export const FACT =
  "「テセウスの船」は、古代ギリシャの著述家プルタルコスが記した問い。のちに哲学者ホッブズが「捨てた板で組み直したら？」と広げた。答えは今も出ていない。";
