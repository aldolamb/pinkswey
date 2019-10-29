import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
let WIDTH = 1000, HEIGHT = 350;
const url = "https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996";
// const url = "https://cf-media.sndcdn.com/q4eW9UxLrdZX.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vcTRlVzlVeExyZFpYLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1NzA5OTYxODB9fX1dfQ__&Signature=QvlIPNSZAumnaXw0IEKbF0JZKB3zaRqw-iwvUoHnSSGOcqJErNnw5T72Lb6v3ZMGeWhvAyl15p2CISM6lSAWMfUoVJEwvks8HKPOmFctuaDdB3kxnojNXKh0PDR9qY4u7KZgEuBVoNM4nRU3VnLc763dgPWY7EgbaLcDHgvo88j0X5aM7jC-TS89oZhipzYaUkNH4sjwVjtVdCZCC-194xgQsCMHYXQHEwSzXCxxNWe5sMN26ZP0ii3ydkwca6GKehoCs27T-rQ07n-3zYALs5r8STM3YRz6RPS6agFWjdApXkv8lVU1iGgy6Fnv69Pw2HB1JL3Pw88Xpq~j-ozHzw__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
  }
`;

const fragmentShader = `
  uniform sampler2D tAudioData;
  varying vec2 vUv;
  vec3 hsl2rgb( in vec3 c )
  {
      vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

      return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }

  void main() {
    vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );
    vec3 color = hsl2rgb(vec3(vUv.y, 1.0, 0.5 ));
    float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;
    float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );
    gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
  }
`;

const AnalyserThree = () => {
  // fetch('https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996', {
  //     method: 'HEAD'
  //   })
  //     .then(response => console.log(response.url))
  //     .catch(console.log("failed"));
  useEffect(() => {

    var scene, camera, renderer, analyser, uniforms;
    var startButton = document.getElementById( 'startButton' );
    startButton.addEventListener( 'click', init );
    async function init() {
      var fftSize = 128 * 16;
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
      //
      var listener = new THREE.AudioListener();
      var audio = new THREE.Audio( listener );
      var mediaElement = new Audio();
      mediaElement.crossOrigin = "anonymous";
      // mediaElement.src = url;
      let source = document.getElementById('audio').src;
      console.log(source);
      mediaElement.src = source;
      // console.log("Before: " + mediaElement.src);
      // mediaElement.src = await fetch(url, {method: 'HEAD'}).then(response => { return response.url; });
      // console.log("After: " + mediaElement.src);
      mediaElement.loop = true;
      mediaElement.play();
      audio.setMediaElementSource( mediaElement );
      analyser = new THREE.AudioAnalyser( audio, fftSize );
      //
      uniforms = {
        tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, THREE.LuminanceFormat ) }
      };
      var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      } );
      var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
      var mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );
      //
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
      // console.log(analyser.data);
      analyser.getFrequencyData();
      uniforms.tAudioData.value.needsUpdate = true;
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
      <div id="container"></div>
      <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br/>
        music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
      </div>
    </div>
  );
}

export default AnalyserThree;
