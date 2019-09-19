import { useState, useEffect } from "react";

function useAudioPlayer() {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(false);
  const [clickedTime, setClickedTime] = useState();
  let audio = null;
  useEffect(() => {
    audio = document.getElementById("audio");
    audio.crossOrigin = "anonymous";

    // console.log(duration);
    // state setters wrappers
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
    }
    // var ctx = new AudioContext();
    // var analyser = ctx.createAnalyser();
    // var audioSrc = ctx.createMediaElementSource(audio);

    // audioSrc.connect(analyser);
    // analyser.connect(ctx.destination);

    // var frequencyDate = new Uint8Array(analyser.frequencyBinCount);
    // console.log("asdfasdf" + frequencyDate)

    const setAudioTime = () => setCurTime(audio.currentTime);

    // DOM listeners: update React state on DOM events
    audio.addEventListener("loadeddata", setAudioData);

    audio.addEventListener("timeupdate", setAudioTime);

    window.addEventListener('keydown', downHandler);

    // React state listeners: update DOM on React state changes
    // playing ? audio.play() : audio.pause();

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime;
      setClickedTime(null);
    } 

    setAudioData();
    setAudioTime();

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      window.removeEventListener('keydown', downHandler);
    }
  },[clickedTime]);

  function downHandler(e) {
    var code;  
    if (e.keyCode) {
    code = e.keyCode;
    } else if (e.which) {
    code = e.which;
    }
    if (code === 32) {
      setPlaying(!playing);
      if (playing)
        audio.pause();
      else 
        audio.play();
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
      return false;
    } else if (code === 37) {
      setClickedTime(curTime - 10);
    } else if (code === 39) {
      setClickedTime(curTime + 10);
    }
  }
  return {
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
    setCurTime,
  }
}

export default useAudioPlayer;
