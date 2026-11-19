// All times are in seconds, measured against public/song.mp3 (theseus_modA.mp3).
// Adjust these numbers to re-sync lyrics with the song.

export const SONG_DURATION = 71.95;

// Section boundaries (where the key changes in the edited song)
export const SECTIONS = {
  intro: 0,
  chorus1: 15.2, // vocals start
  key1: 15.4, // +1 semitone
  key2: 31.26, // +2 semitones
  key3: 44.85, // +3 semitones (final chorus)
  outro: 62.92, // back to original key
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
  // Chorus 1 — times from the user's listening notes
  { start: 15.2, end: 18.1, text: "トンカン トンカン/いちまい かえて", kind: "lead", lineTimes: [15.2, 17.0] },
  { start: 18.1, end: 19.2, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 19.2, end: 22.5, text: "おなじ？ おなじ？", kind: "crowd" },
  { start: 22.5, end: 24.4, text: "トンカン トンカン/にまい かえて", kind: "lead" },
  { start: 24.4, end: 26.3, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 26.3, end: 30.0, text: "おなじ？ おなじ？", kind: "crowd" },
  // Verse
  { start: 30.0, end: 31.6, text: "ひゃくまい/かえたら？", kind: "lead" },
  { start: 31.6, end: 33.4, text: "にひゃくまい/かえたら？", kind: "lead" },
  { start: 33.4, end: 37.8, text: "さんびゃくまい/ぜんぶ かえたら？", kind: "lead" },
  // Break (instrumental)
  { start: 37.8, end: 44.4, text: "これって まだ/テセウスの船？", kind: "whisper" },
  // Final chorus — only the first start time is confirmed; the rest are estimates
  { start: 44.5, end: 47.0, text: "トンカン トンカン/すてた いたで", kind: "lead" },
  { start: 47.0, end: 49.5, text: "トンカン トンカン/もう いっせき", kind: "lead" },
  { start: 49.5, end: 52.0, text: "どっち！ どっち！", kind: "crowd" },
  { start: 52.0, end: 54.5, text: "トンカン トンカン/ほんもの どっち？", kind: "lead" },
  { start: 54.5, end: 57.0, text: "トンカン トンカン/わからん わからん", kind: "lead" },
  { start: 57.0, end: 59.6, text: "わからん！ わからん！", kind: "crowd" },
  // Outro (estimated)
  { start: 63.0, end: 66.0, text: "きのうの きみと/きょうの きみ", kind: "whisper" },
  { start: 66.0, end: 69.0, text: "……まだ おなじ？", kind: "whisper" },
  { start: 69.0, end: 71.95, text: "トン・カン", kind: "lead" },
];

// Plank counter keyframes: [time, planks replaced] (out of 300)
export const PLANK_KEYS: [number, number][] = [
  [15.2, 1],
  [22.4, 1],
  [22.5, 2],
  [29.9, 2],
  [30.0, 100],
  [31.5, 100],
  [31.6, 200],
  [33.3, 200],
  [33.4, 300],
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
