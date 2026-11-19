import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { dela, mincho } from "./fonts";
import { Ship } from "./Ship";
import { themeAt } from "./theme";

// TikTok cover (1080x1920). Key content stays inside the centre 3:4 area
// (y ≈ 240–1680), which is what the profile grid shows.

type Props = { variant: "A" | "B" };

export const Cover: React.FC<Props> = ({ variant }) => {
  const dark = variant === "B";
  const theme = themeAt(dark ? 50 : 0);
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: dela, color: theme.ink, alignItems: "center" }}>
      <div
        style={{
          marginTop: 270,
          fontSize: 40,
          color: theme.accent,
          border: `4px solid ${theme.accent}`,
          borderRadius: 999,
          padding: "6px 30px",
        }}
      >
        もしも哲学 #1
      </div>

      {dark ? (
        <>
          <div style={{ marginTop: 40, fontFamily: mincho, fontWeight: 700, fontSize: 60 }}>捨てた板で もう一隻</div>
          <div style={{ marginTop: 6, fontSize: 150, lineHeight: 1.05, color: theme.accent, textAlign: "center" }}>
            本物は
            <br />
            どっち？
          </div>
          <div style={{ position: "absolute", top: 860, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ width: 500, height: 262 }}>
              <Ship theme={theme} replaced={30} flash={0} label="新しい板の船" />
            </div>
            <div style={{ width: 500, height: 262 }}>
              <Ship theme={theme} replaced={0} allOld flash={0} label="捨てた板の船" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 40, fontFamily: mincho, fontWeight: 700, fontSize: 64, textAlign: "center", lineHeight: 1.3 }}>
            300枚 ぜんぶ
            <br />
            かえた船は
          </div>
          <div style={{ marginTop: 10, fontSize: 160, lineHeight: 1.05, color: theme.accent, textAlign: "center" }}>
            まだ
            <br />
            同じ船？
          </div>
          <div style={{ position: "absolute", top: 1030, left: 140, width: 800, height: 420 }}>
            <Ship theme={theme} replaced={17} flash={0} />
          </div>
        </>
      )}

      {/* たらればくん */}
      <Img
        src={staticFile("tarareba.png")}
        style={{ position: "absolute", width: 380, right: 40, top: dark ? 1210 : 1330 }}
      />
    </AbsoluteFill>
  );
};
