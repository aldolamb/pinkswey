import React, { 
  useRef 
} from "react";
import {
  Bar as BarStyled,
  Progress,
  ProgressKnob,
  Time,
} from './styled';
import { padding } from "polished";
// import moment from "moment";
// import momentDurationFormatSetup from "moment-duration-format";

export function formatDuration(duration) {
  if (!duration)
    return "00:00"
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
// return moment
//   .duration(duration, "seconds")
//   .format("mm:ss", { trim: false });
}

export default function Bar(props) {
  const { duration, curTime, onTimeUpdate } = props;

  const curPercentage = (curTime / duration) * 100;

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.querySelector("#bar__progress");
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = eMove => {
      onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <BarStyled>
      <Time>{formatDuration(curTime)}</Time>
      <Progress
        id="bar__progress"
        style={{
          // background: `linear-gradient(to right, #46f737 ${curPercentage/4}%, #e9ff15 ${curPercentage/2}%, #ff551a ${curPercentage * 3 / 4}%, #ff1d53 ${curPercentage}%, white 0)`
          background: `linear-gradient(to right, #ff1d53 0%, #ff551a ${curPercentage / 2}%, #e9ff15 ${curPercentage}%, white 0)`
        }}
        onMouseDown={e => handleTimeDrag(e)}
      >
        <ProgressKnob
          style={{ left: `${curPercentage - 1}%` }}
        />
      </Progress>
      <Time>{formatDuration(duration)}</Time>
      {/* <input style={{margin: '0 20px', width: '100px'}} type="range" min="0" max="100" step='10' id="latency"/> */}
    </BarStyled>
  );
}
