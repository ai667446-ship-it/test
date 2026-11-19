import { Composition } from "remotion";
import { Theseus } from "./Theseus";
import { TimingCheck } from "./TimingCheck";
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
    </>
  );
};
