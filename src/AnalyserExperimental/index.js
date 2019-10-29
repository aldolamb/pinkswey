import React, {useEffect, useState}  from 'react';
import { ControlPanel, Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  let ground, geometry, length, time = 0;
  let frequency = true;
  let binCount = 256;

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
      controls.autoRotateSpeed = -2;


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
      analyser.fftSize = 2 ** 9;

      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      sliceWidth = 1000 * 1 / bufferLength;

      function addLight(){
        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      function addGround(){
        var groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
        geometry = new THREE.PlaneGeometry(1000,1000,bufferLength-1,100);
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
        ground.position.x = 200;
        ground.position.y = -128;

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
        geometry.vertices[i].z = (dataArray[i]);
      geometry.verticesNeedUpdate = true;

      geometry.faces.forEach(function(face){
        var val = 0.8 - (geometry.vertices[face.a].z / 256);
        // face.color.setHSL(val, 1.0, 0.5)
        // face.color.setHSL(val, 1.0, val < .8 ? 0.5 - val/4 : 0)
        face.color.setHSL(val, 1.0, val < .8 ? 0.4 : 0)
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
      <ControlPanel>
        <table>
          <tbody>
            <tr>
              <td>
                Data Type<br/>
                Frequency
                <input onChange={() => {frequency = true; ground.position.x = 200;}} type="radio" name="myRadios" value="1" defaultChecked/><br/>
                Time
                <input onChange={() => {frequency = false; ground.position.x = 0;}} type="radio" name="myRadios" value="2" />
              </td>
            </tr>
            <tr>
              <td>
                Camera Positions<br/>
                <button onClick={() => {camera.position.set( 0, 0, 1000 );} }>1</button>
                <button onClick={() => {camera.position.set( 0, 0, -1000 );} }>2</button>
                <button onClick={() => {camera.position.set( 0, 1000, 0 );} }>3</button>
                <button onClick={() => {camera.position.set( 1000, 0, 0 );} }>4</button>
                <button onClick={() => {camera.position.set( 600, 800, 600 );} }>5</button>
              </td>
            </tr>
            <tr>
              <td>
                Auto Rotate<br/>
                <input onChange={(e) => {controls.autoRotate = e.target.checked;}} type="checkbox" name="rotate" value="1"/>
              </td>
            </tr>
          </tbody>
        </table>
      </ControlPanel>
      {/* <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener noreferrer">three.js</a> webaudio - visualizer<br/>
        music by <a href="http://www.newgrounds.com/audio/listen/376737" target="_blank" rel="noopener">skullbeatz</a>
      </div> */}
    </div>
  );
}

export default AnalyserThree;
