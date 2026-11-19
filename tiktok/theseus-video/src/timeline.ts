// All times are in seconds, measured against public/song.mp3 (theseus_modA.mp3).
// Adjust these numbers to re-sync lyrics with the song.

export const SONG_DURATION = 71.95;

// Section boundaries (where the key changes in the edited song)
export const SECTIONS = {
  intro: 0,
  chorus1: 14.0, // vocals start
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
  // Chorus 1 (planks 1 → 100)
  { start: 14.0, end: 17.0, text: "トンカン トンカン/いちまい かえて", kind: "lead" },
  { start: 17.0, end: 20.0, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 20.0, end: 22.4, text: "おなじ！ おなじ！", kind: "crowd" },
  { start: 22.4, end: 25.3, text: "トンカン トンカン/ひゃくまい かえて", kind: "lead" },
  { start: 25.3, end: 28.3, text: "トンカン トンカン/まだ おなじ？", kind: "lead" },
  { start: 28.3, end: 31.2, text: "おなじ！ ……おなじ？", kind: "crowd" },
  // Chorus 2 (planks → 300)
  { start: 31.3, end: 35.0, text: "トンカン トンカン/さんびゃくまい", kind: "lead" },
  { start: 35.0, end: 38.0, text: "トンカン トンカン/ぜんぶ かえた", kind: "lead" },
  { start: 38.0, end: 44.8, text: "これって まだ/テセウスの船？", kind: "whisper" },
  // Final chorus (two ships)
  { start: 44.85, end: 47.9, text: "トンカン トンカン/すてた いたで", kind: "lead" },
  { start: 47.9, end: 50.9, text: "トンカン トンカン/もう いっせき", kind: "lead" },
  { start: 50.9, end: 53.9, text: "どっち！ どっち！", kind: "crowd" },
  { start: 53.9, end: 56.9, text: "トンカン トンカン/ほんもの どっち？", kind: "lead" },
  { start: 56.9, end: 59.9, text: "トンカン トンカン/わからん わからん", kind: "lead" },
  { start: 59.9, end: 62.9, text: "わからん！ わからん！", kind: "crowd" },
  // Outro
  { start: 63.0, end: 66.6, text: "きのうの きみと/きょうの きみ", kind: "whisper" },
  { start: 66.6, end: 70.3, text: "……まだ おなじ？", kind: "whisper" },
  { start: 70.3, end: 71.95, text: "トン・カン", kind: "lead" },
];

// Plank counter keyframes: [time, planks replaced] (out of 300)
export const PLANK_KEYS: [number, number][] = [
  [14.0, 0],
  [16.0, 1],
  [22.4, 2],
  [25.3, 100],
  [31.3, 150],
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
