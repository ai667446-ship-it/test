// Times in seconds against public/socrates.mp3 (key-changed edit of the Suno take).
// Lyric times are ESTIMATES from Suno's lyric view + vocal analysis — replace them
// with exact times once the captioned (CapCut) version is available.

export const DURATION = 50.78;

export const SECTIONS = {
  chorus: 8.43, // first sung chorus
  key1: 19.98, // +1 semitone (verse)
  key2: 25.8, // +2 semitones (final chorus / trial)
  outro: 41.54, // back to original key
};

export type Kind = "lead" | "crowd" | "whisper";
export type Line = { start: number; end: number; text: string; kind: Kind };

export const LYRICS: Line[] = [
  { start: 2.35, end: 8.3, text: "ナゼ・ナゼ・ナゼ・ナゼ", kind: "lead" },
  // Chorus
  { start: 8.43, end: 11.7, text: "ナゼナゼ ナゼナゼ/あいつが わるい！", kind: "lead" },
  { start: 11.7, end: 15.4, text: "ナゼナゼ ナゼナゼ/なぜ わるい？", kind: "lead" },
  { start: 15.4, end: 17.3, text: "じょうしき！", kind: "crowd" },
  { start: 17.3, end: 19.9, text: "ナゼナゼ ナゼナゼ/みんなって だれ？", kind: "lead" },
  { start: 19.98, end: 21.9, text: "……だれ？", kind: "crowd" },
  // Verse
  { start: 21.9, end: 23.8, text: "ひとり ろんぱ/（なぜ？）", kind: "lead" },
  { start: 23.8, end: 25.7, text: "ひゃくにん ろんぱで/えんじょう！", kind: "lead" },
  // Final chorus (trial)
  { start: 25.8, end: 29.5, text: "ナゼナゼ ナゼナゼ/さいばん だ！", kind: "lead" },
  { start: 29.5, end: 33.2, text: "ゆうざい！ ゆうざい！", kind: "crowd" },
  { start: 33.2, end: 37.0, text: "280 たい 220", kind: "lead" },
  { start: 37.0, end: 41.4, text: "ナゼナゼ ナゼナゼ/それでも なぜ？", kind: "lead" },
  // Outro
  { start: 41.54, end: 43.5, text: "……きみは なぜ/そう おもうの？", kind: "whisper" },
  { start: 43.5, end: 50.78, text: "ナゼ・ナゼ", kind: "lead" },
];

// "論破" counter keyframes [time, people]
export const ROMPA_KEYS: [number, number][] = [
  [8.4, 0],
  [19.9, 3],
  [23.8, 10],
  [25.7, 100],
];

// Vote counting during the trial
export const VOTES = { guilty: 280, notGuilty: 220, start: 29.5, end: 37.0 };

export const COMMENTS = [
  "あいつが悪い！",
  "常識でしょ",
  "みんな言ってる",
  "ありえない",
  "常識ない人？",
  "普通わかるよね",
  "論破されたｗ",
  "うるさい",
  "ブロックしました",
];

export const HOOK = {
  small: "もしもソクラテスが",
  big: "コメント欄に\nいたら",
  question: "何人論破できる？",
};

export const FACT =
  "紀元前399年、ソクラテスは「若者を堕落させた」などの罪で市民の裁判にかけられ、約280対220で有罪に。最後は毒杯を飲んで亡くなった。本人の言葉に近いのは「知らないことを、知っているとは思わない」。";
