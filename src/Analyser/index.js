import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  let geometry, length, time = 0;

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
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
      // 
      camera.position.set( 0, 0, 1000 );
      camera.lookAt( 0, 0, 0 );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableKeys = false;
      controls.minDistance = 15;
      controls.maxDistance = 1500;
      controls.maxPolarAngle = Math.PI / 2;


      ctx = new AudioContext();
      var mediaElement = document.getElementById('audio');
      mediaElement.play();
      // var mediaElement = new Audio();
      // mediaElement.crossOrigin = "anonymous";
      // mediaElement.src = document.getElementById('audio').src;
      // mediaElement.loop = true;
      // mediaElement.play();

      analyser = ctx.createAnalyser();
      audioSrc = ctx.createMediaElementSource(mediaElement);

      audioSrc.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.fftSize = 2 ** 7;

      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      sliceWidth = 1000 * 1 / bufferLength;

      window.addEventListener( 'resize', onResize, false );
      animate();
    }
    function onResize() {
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function animate() {
      render();
      requestAnimationFrame( animate );
    }
    function render() {
      analyser.getByteFrequencyData(dataArray);
      // analyser.getByteTimeDomainData(dataArray);
      
      var geometry = new THREE.Geometry();
      var x = -1000/2;
      for(var i = 0; i < bufferLength; i++) {
        geometry.vertices.push(new THREE.Vector3( x, (dataArray[i]-128), 0) );
        x += sliceWidth;
      }
      var line = new THREE.Line( geometry, material );
      scene.add( line );

      let len = scene.children.length;
      if (len > 100) 
        scene.remove(scene.children[0]);

      for (let i in scene.children)
        scene.children[i].position.set(0,0,(len/2 - i) * 10);

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
      {/* <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br/>
        music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
      </div> */}
    </div>
  );
}

export default AnalyserThree;
