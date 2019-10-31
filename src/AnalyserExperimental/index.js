import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from '../CameraControls';
import { Camera } from 'three';

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  let ground, geometry, length, time = 0;
  let frequency = true;
  let binCount = 256;
  var mediaElement;

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
      camera.position.set( 0, 1200, 0 );
      camera.lookAt( 0, 0, 0 );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableKeys = false;
      controls.minDistance = 15;
      controls.maxDistance = 2000;
      controls.maxPolarAngle = Math.PI / 2;
      controls.autoRotateSpeed = -2;


      ctx = new AudioContext();
      mediaElement = document.getElementById('audio');
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
      analyser.fftSize = 2 ** 12;

      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      bufferLength = analyser.frequencyBinCount / 8;
      dataArray = new Uint8Array(bufferLength);
      
      material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      sliceWidth = 1000 * 1 / bufferLength;

      function addLight(){
        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      function addGround(){
        var groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
        geometry = new THREE.PlaneGeometry(2000,1000,bufferLength-1,100);
        length = geometry.vertices.length;
        
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        var planeMat = new THREE.MeshLambertMaterial( {vertexColors: THREE.FaceColors, side: THREE.DoubleSide}  );
        ground = new THREE.Mesh(geometry,planeMat); 

        geometry.faces.forEach(function(face){
          var val = geometry.vertices[face.c].z / 100
          face.color.setHSL(val, 1, 0.5)
        });
        geometry.colorsNeedUpdate = true;
        ground.rotation.x = -Math.PI/2;
        // ground.position.x = 200;
        ground.position.y = -256;

        scene.add(ground);
      }
      addLight();
      addGround();
      console.log(bufferLength, length)

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
      // time = (time + bufferLength) % length;

      if (frequency)
        analyser.getByteFrequencyData(dataArray);
      else
        analyser.getByteTimeDomainData(dataArray);

      for (let i = length-1; i >= bufferLength; i--)
        geometry.vertices[i].z = geometry.vertices[i-bufferLength].z;
      for (let i = 0; i < bufferLength; i++)
        geometry.vertices[i].z = (dataArray[i] * 2);
      geometry.verticesNeedUpdate = true;

      geometry.faces.forEach(function(face){
        var val = 1.2 - (geometry.vertices[face.a].z / 400);
        // face.color.setHSL(val, 1.0, 0.5)
        face.color.setHSL(val, 1.0, val < .8 ? 0.4 - val/2 : 0)
        // face.color.setHSL(val, 1.0, val < .8 ? 0.4 : 0)
      });
      geometry.colorsNeedUpdate = true;
      /*
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
        */

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
      <CameraControls 
        setCamera={(p1,p2,p3) => {camera.position.set(p1,p2,p3)}}
      />
      {/* <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br/>
        music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
      </div> */}
      <input type="file"
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
       ></input>
    </div>
  );
}

export default AnalyserThree;
