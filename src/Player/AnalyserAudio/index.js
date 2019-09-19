import React, {useEffect, useState}  from 'react';
import { Visualizer } from './styled';
import * as THREE from 'three';
let WIDTH = 800, HEIGHT = 350;
// var latency = 1;
var mouseDown = false;

const AnalyserThree = () => {

  var scene, camera, renderer, analyser, uniforms;

  function vertexShader() {
    return `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4( position, 1.0 );
    }
    `
  }

  function fragmentShader() {
    return `
    uniform sampler2D tAudioData;
    varying vec2 vUv;
    void main() {
      vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );
      vec3 color = vec3( 1.0, 1.0, 0.0 );
      float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;
      float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );
      gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
    }
    `
  }

  useEffect(() => {
    var fftSize = 2048;
    //
    var overlay = document.getElementById( 'overlay' );
    overlay.remove();
    //
    var container = document.getElementById( 'container' );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    camera.position.set( 0, 0, 1.5 );
    camera.lookAt( 0, 0, 0 );
    //
    var listener = new THREE.AudioListener();
    var audio = new THREE.Audio( listener );
    // var mediaElement = new Audio( 'sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3' );
    // mediaElement.loop = true;
    // mediaElement.play();
    var mediaElement = document.getElementById('audio');
    audio.setMediaElementSource( mediaElement );
    analyser = new THREE.AudioAnalyser( audio, fftSize );
    //
    uniforms = {
      tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, THREE.LuminanceFormat ) }
    };
    var material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
      // vertexShader: document.getElementById( 'vertexShader' ).textContent,
      // fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //
    window.addEventListener( 'resize', onResize, false );
    animate();
  }, []);

  function onResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  function animate() {
    requestAnimationFrame( animate );
    render();
  }
  function render() {
    analyser.getFrequencyData();
    uniforms.tAudioData.value.needsUpdate = true;
    renderer.render( scene, camera );
  }

  return (
    <div>
    <div id="overlay">
    <Visualizer id='canvas' width={WIDTH} height={HEIGHT}
    />
    </div>
    <div id="container"></div>
    </div>
  );
}

export default AnalyserThree;
