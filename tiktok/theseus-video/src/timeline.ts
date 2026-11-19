// All times are in seconds, measured against public/song.mp3 (theseus_modA.mp3).
// Adjust these numbers to re-sync lyrics with the song.

export const SONG_DURATION = 71.95;

// Section boundaries (where the key changes in the edited song)
export const SECTIONS = {
  intro: 0,
  chorus1: 13.3, // vocals start
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
};

export const LYRICS: Lyric[] = [
  // Intro chant
  { start: 13.3, end: 15.4, text: "トン・カン・トン・カン/ヘイ！", kind: "lead" },
  // Chorus 1 (planks 1 → 100)
  { start: 15.4, end: 18.0, text: "トンカン トンカン/いちまい かえて", kind: "lead" },
  { start: 18.0, end: 20.6, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 20.6, end: 23.2, text: "おなじ！ おなじ！", kind: "crowd" },
  { start: 23.2, end: 25.8, text: "トンカン トンカン/ひゃくまい かえて", kind: "lead" },
  { start: 25.8, end: 28.4, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 28.4, end: 31.2, text: "おなじ！ ……おなじ？", kind: "crowd" },
  // Chorus 2 (planks → 300)
  { start: 31.6, end: 34.6, text: "トンカン トンカン/さんびゃくまい", kind: "lead" },
  { start: 34.6, end: 37.8, text: "トンカン トンカン/ぜんぶ かえた", kind: "lead" },
  // Break (instrumental)
  { start: 37.8, end: 46.4, text: "これって まだ/テセウスの船？", kind: "whisper" },
  // Final chorus (two ships)
  { start: 46.5, end: 48.67, text: "トンカン トンカン/すてた いたで", kind: "lead" },
  { start: 48.67, end: 50.83, text: "トンカン トンカン/もう いっせき", kind: "lead" },
  { start: 50.83, end: 53.0, text: "どっち！ どっち！", kind: "crowd" },
  { start: 53.0, end: 55.17, text: "トンカン トンカン/ほんもの どっち？", kind: "lead" },
  { start: 55.17, end: 57.33, text: "トンカン トンカン/わからん わからん", kind: "lead" },
  { start: 57.33, end: 59.6, text: "わからん！ わからん！", kind: "crowd" },
  // Outro
  { start: 63.0, end: 66.0, text: "きのうの きみと/きょうの きみ", kind: "whisper" },
  { start: 66.0, end: 69.0, text: "……まだ おなじ？", kind: "whisper" },
  { start: 69.0, end: 71.95, text: "トン・カン", kind: "lead" },
];

// Plank counter keyframes: [time, planks replaced] (out of 300)
export const PLANK_KEYS: [number, number][] = [
  [15.4, 1],
  [20.6, 2],
  [23.2, 100],
  [31.6, 150],
  [36.5, 300],
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
