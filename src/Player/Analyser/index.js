import React, {useEffect, useState}  from 'react';
import { Visualizer } from './styled';
let WIDTH = 800, HEIGHT = 350;
// var latency = 1;
var mouseDown = false;

const Analyser = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var audio, ctx, analyser, audioSrc, frequencyDate;
  var canvas, cwidth, cheight, meterWidth, gap, capHeight, capStyle, meterNum, capYPositionArray;
  var bufferLength, dataArray, latency;
  useEffect(() => {
    audio = document.getElementById('audio');
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    audioSrc = ctx.createMediaElementSource(audio);

    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    frequencyDate = new Uint8Array(analyser.frequencyBinCount);

    canvas = document.getElementById('canvas');
    cwidth = canvas.width;
    cheight = canvas.height - 2;
    meterWidth = 10; //width of the meters in the spectrum
    gap = 2; //gap between meters
    capHeight = 2;
    capStyle = '#fff';
    meterNum = 800 / (10 + 2); //count of the meters
    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d');
    // gradient = ctx.createLinearGradient(0, 0, 0, 300);
    // gradient.addColorStop(1, '#0f0');
    // gradient.addColorStop(0.5, '#ff0');
    // gradient.addColorStop(0, '#f00');
    // loop

    // renderFrame();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw();
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx.canvas.width  = WIDTH;
    ctx.canvas.height = window.innerHeight;
  }, []);

  function draw() {
    // latency = document.getElementById('latency');
    var drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    // analyser.getByteFrequencyData(dataArray);
    // ctx.fillStyle = `rgba(244,247,220,${mouseDown ? 0.1 : 1})`;
    ctx.fillStyle = `rgba(0,0,0,${mouseDown ? 0.1 : 1})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 2;
    // ctx.strokeStyle = 'rgb(38,38,38)';
    ctx.strokeStyle = 'rgb(244,247,220)';
    ctx.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          ctx.moveTo(x, y / 2 + HEIGHT / 4);
        } else {
          ctx.lineTo(x, y / 2 + HEIGHT / 4);
        }

        x += sliceWidth;
      }
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
  };

//   function renderFrame() {
//     var array = new Uint8Array(analyser.frequencyBinCount);
//     analyser.getByteFrequencyData(array);
//     var step = Math.round(array.length / meterNum); //sample limited data from the total array
//     ctx.clearRect(0, 0, cwidth, cheight);
//     for (var i = 0; i < meterNum; i++) {
//         var value = array[i * step];
//         if (capYPositionArray.length < Math.round(meterNum)) {
//             capYPositionArray.push(value);
//         };
//         ctx.fillStyle = capStyle;
//         //draw the cap, with transition effect
//         if (value < capYPositionArray[i]) {
//             ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
//         } else {
//             ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
//             capYPositionArray[i] = value;
//         };
//         // ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
//         ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
//     }
//     requestAnimationFrame(renderFrame);
//   }

  return (
    <Visualizer id='canvas' width={WIDTH} height={HEIGHT}
        // onMouseDown={() => mouseDown=true} 
        // onMouseUp={() => mouseDown=false}
        onClick={() => mouseDown = !mouseDown}
        // onClick={() => latency = latency < .05 ? 1 : latency / 2}
    />
  );
}

export default Analyser;
