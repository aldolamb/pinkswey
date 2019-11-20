import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from '../CameraControls';
import { Camera } from 'three';

import { addLandscape, updateLandscape } from './Visualizers/landscape';
import { addLine, updateLine } from './Visualizers/line';
import { addLines, updateLines } from './Visualizers/lines';
import { addParticles, updateParticles } from './Visualizers/particles';
import { addSphere, updateSphere } from './Visualizers/sphere';

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, bufferLength, dataArray, sliceWidth;
  var mediaElement;
  let line;
  var frequencyData, timeDomainData;

  useEffect(() => {
    var startButton = document.getElementById( 'startButton' );
    startButton.addEventListener( 'click', init );
    
    async function init() {
      var overlay = document.getElementById( 'overlay' );
      overlay.remove();
      //
      var canvas = document.getElementById("canvas");
      renderer = new THREE.WebGLRenderer( { canvas: canvas } );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor( 0x000000 );
      renderer.setPixelRatio( window.devicePixelRatio );
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2500 );
      // 
      camera.position.set( 0, 0, 150 );
      camera.lookAt( 0, 0, 0 );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableKeys = false;
      controls.minDistance = 1;
      controls.maxDistance = 2000;
      // controls.maxPolarAngle = Math.PI / 2;
      controls.autoRotateSpeed = -2;

      ctx = new AudioContext();
      mediaElement = document.getElementById('audio');
      mediaElement.play();

      analyser = ctx.createAnalyser();
      audioSrc = ctx.createMediaElementSource(mediaElement);

      audioSrc.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.fftSize = 512;
      // analyser.fftSize = 2 ** 10;

      bufferLength = analyser.frequencyBinCount;
      // bufferLength = analyser.frequencyBinCount / 8;
      frequencyData = new Uint8Array(bufferLength);
      timeDomainData = new Uint8Array(bufferLength);

      function addLight(){
        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      addLight();

      // addLandscape(scene, bufferLength);
      addLine(scene, bufferLength);
      // addLines(scene, bufferLength);
      // addParticles(scene);
      addSphere(scene);

      window.addEventListener( 'resize', onResize, false );
      animate();
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
      render();
      requestAnimationFrame( animate );
    }

    function render() {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeDomainData);

      // updateLandscape(frequencyData);   
      updateLine(timeDomainData);   
      // updateLines(timeDomainData);  
      // updateParticles(frequencyData, bufferLength);   
      updateSphere(frequencyData);

      controls.update();
      renderer.render( scene, camera );
    }
  }, []);

  return (
    <div>
      <Overlay id="overlay">
        <div>
          <button id="startButton">Click to Play</button>
          <p>Audio playback requires user interaction.</p>
        </div>
      </Overlay>
      <div id="container">
        <Visualizer id='canvas'/>
      </div>
      {/* <CameraControls 
        setCamera={(p1,p2,p3) => {camera.position.set(p1,p2,p3)}}
      /> */}
      {/* <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br/>
        music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
      </div> */}
      {/* <input type="file"
      style={{position: "absolute", zIndex: "998"}}
      onChange={(event)=> {
        var sound = document.getElementById('audio');
        sound.src = URL.createObjectURL(event.target.files[0]);
        sound.play();
        // not really needed in this exact case, but since it is really important in other cases,
        // don't forget to revoke the blobURI when you don't need it
        sound.onend = function(e) {
          URL.revokeObjectURL(event.target.src);
        }
      }}
       id="avatar" name="avatar"
      //  accept="image/png, image/jpeg"
       ></input> */}
    </div>
  );
}

export default AnalyserThree;
