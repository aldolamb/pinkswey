import React, {useEffect} from "react";

import Song from "./Song";
import PlayPause from "./PlayPause";
import Bar from "./Bar";
import Analyser from "./Analyser";
import Tracklist from "./Tracklist";

import Shirts from "../Shirts";

import useAudioPlayer from './useAudioPlayer';

import GraveyardShift from '../assets/GraveyardShift';
import PinkSwey from '../assets/PinkSwey';

import {
  Controls,
  Player as PlayerStyled,
} from './styled';

function Player() {
  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer();

  return (
    <div className="more">
      <PlayerStyled className="player">
        {/* <Song songName="Graveyard Shift" songArtist="" /> */}
        <GraveyardShift/>
        <Controls>
          <PlayPause
            playing={playing}
            setPlaying={setPlaying}
          />
          <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)}/>
        </Controls>
        <PinkSwey/>
      </PlayerStyled>
      {/* <Tracklist setClickedTime={setClickedTime}/> */}
      <Shirts/>
    </div>
  );
}

export default Player;
