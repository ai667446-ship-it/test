import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled locally (SIL Open Font License) so rendering works offline.
export const dela = "Dela Gothic One";
export const mincho = "Zen Old Mincho";

loadFont({ family: dela, url: staticFile("fonts/DelaGothicOne.ttf"), weight: "400" });
loadFont({ family: mincho, url: staticFile("fonts/ZenOldMincho-Regular.ttf"), weight: "400" });
loadFont({ family: mincho, url: staticFile("fonts/ZenOldMincho-Bold.ttf"), weight: "700" });
