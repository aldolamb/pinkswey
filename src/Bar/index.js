import React, { 
  useRef 
} from "react";

import PlayPause from "./PlayPause";
import Progress from "./Progress";

import useAudioPlayer from './useAudioPlayer';

import GraveyardShift from '../assets/GraveyardShift';
import PinkSwey from '../assets/PinkSwey';

import {
  Controls,
  Player as PlayerStyled,
} from './styled';


export default function Bar(props) {
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();

  return (
    <PlayerStyled className="player">
        <GraveyardShift/>
        <Controls>
          <PlayPause
            playing={playing}
            setPlaying={setPlaying}
          />
          <Progress curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)}/>
        </Controls>
        <PinkSwey/>
      </PlayerStyled>
  );
}
