import { Composition } from 'remotion';
import { BoltFoodPromo } from './BoltFoodPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BoltFoodPromo"
        component={BoltFoodPromo}
        durationInFrames={990}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
