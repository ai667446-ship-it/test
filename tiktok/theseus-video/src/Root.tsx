import { Composition } from "remotion";
import { Theseus } from "./Theseus";
import { TimingCheck } from "./TimingCheck";
import { Cover } from "./Cover";
import { Socrates } from "./socrates/Socrates";
import { DURATION as SOC_DURATION } from "./socrates/timeline";
import { Still } from "remotion";
import { SONG_DURATION } from "./timeline";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Theseus"
        component={Theseus}
        durationInFrames={Math.round(SONG_DURATION * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="TimingCheck"
        component={TimingCheck}
        durationInFrames={Math.round(SONG_DURATION * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Socrates"
        component={Socrates}
        durationInFrames={Math.round(SOC_DURATION * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Still id="CoverA" component={Cover} defaultProps={{ variant: "A" as const }} width={1080} height={1920} />
      <Still id="CoverB" component={Cover} defaultProps={{ variant: "B" as const }} width={1080} height={1920} />
    </>
  );
};
