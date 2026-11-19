// Times in seconds against public/sunkcost.mp3 (key-changed edit of the Suno take).
// Lyric times are ESTIMATES from vocal analysis — replace with exact times from
// the captioned (CapCut) version when available.

export const DURATION = 59.23;

export const SECTIONS = {
  chorus: 6.46,
  key1: 22.62, // +1 (verse: Concorde)
  breakStart: 27.86, // instrumental: explanation card
  key2: 37.36, // +2 (final chorus: やーめた)
  outro: 51.71, // back to original key
};

export type Kind = "lead" | "crowd" | "whisper";
export type Line = { start: number; end: number; text: string; kind: Kind };

export const LYRICS: Line[] = [
  { start: 0.49, end: 6.4, text: "ポチポチ ポチポチ/（ヘイ！）", kind: "lead" },
  // Chorus
  { start: 6.46, end: 8.3, text: "ポチポチ ポチポチ/100えん", kind: "lead" },
  { start: 8.3, end: 10.2, text: "もったいない！", kind: "crowd" },
  { start: 10.2, end: 12.0, text: "ポチポチ ポチポチ/1000えん", kind: "lead" },
  { start: 12.0, end: 13.9, text: "もったいない！", kind: "crowd" },
  { start: 13.9, end: 15.8, text: "ポチポチ ポチポチ/1まんえん", kind: "lead" },
  { start: 15.8, end: 19.0, text: "もったいない！ もったいない！", kind: "crowd" },
  { start: 19.0, end: 22.55, text: "ズルズル ズルズル/やめられない", kind: "lead" },
  // Verse
  { start: 22.62, end: 24.0, text: "ズルズル ズルズル/コンコルド", kind: "lead" },
  { start: 24.0, end: 25.0, text: "あかじ！", kind: "crowd" },
  { start: 25.0, end: 26.8, text: "ズルズル ズルズル/つくりつづけた", kind: "lead" },
  { start: 26.8, end: 27.8, text: "あかじ！ あかじ！", kind: "crowd" },
  // Final chorus
  { start: 37.36, end: 39.2, text: "ポチポチ ポチポチ/やーめた！", kind: "lead" },
  { start: 39.2, end: 41.1, text: "やーめた！", kind: "crowd" },
  { start: 41.1, end: 43.0, text: "ズルズル ズルズル/やーめた！", kind: "lead" },
  { start: 43.0, end: 44.9, text: "やーめた！", kind: "crowd" },
  { start: 44.9, end: 48.6, text: "もどらない もどらない/つかったぶんは", kind: "lead" },
  { start: 48.6, end: 51.6, text: "これから だけで/きめれば いい", kind: "lead" },
  // Outro
  { start: 51.71, end: 55.5, text: "ポチポチ……/やーめた！", kind: "lead" },
];

// Money spent on the gacha [time, yen]
export const MONEY_KEYS: [number, number][] = [
  [6.4, 0],
  [6.46, 100],
  [10.1, 100],
  [10.2, 1000],
  [13.8, 1000],
  [13.9, 10000],
];

export const HOOK = {
  small: "つまらない映画",
  big: "最後まで\n見ちゃう人へ",
  question: "それ、名前があります",
};

export const EXPLAIN = {
  title: "サンクコスト",
  sub: "（埋没費用）",
  body: "もう使ってしまって\n取り戻せないお金や時間のこと",
  note: "「もったいない」と思って続けるほど\n損が大きくなりやすい",
};

export const TAKEAWAY = "もう戻らない\nお金や時間で\nこれからを決めない";

export const FACT =
  "英仏共同開発の超音速旅客機コンコルドは、採算が合わないと見込まれても開発が続けられた。この例から、サンクコストにとらわれることを「コンコルド効果（コンコルドの誤謬）」とも呼ぶ。";
