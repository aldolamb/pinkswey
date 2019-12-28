import React from "react";
import Play from "../../assets/icons/PlayCircle";
import Pause from "../../assets/icons/PauseCircle";
import {
  Button
} from './styled';

const PlayPause = ({
  playing,
  setPlaying,
}) => {
  let audio = document.getElementById("audio")
  return (
    <Button 
    // onClick={() => setPlaying(!playing)}
    onClick={() => {!playing ? audio.play() : audio.pause(); setPlaying(!playing)}}
    >
      {playing ? <Pause/> : <Play/>}
    </Button>
  );
}

export default PlayPause;
