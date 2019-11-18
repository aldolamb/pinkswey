import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from '../CameraControls';
import { Camera } from 'three';
var SimplexNoise = require('simplex-noise'),
noise = new SimplexNoise(Math.random);

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  let ground, geometry, length, time = 0;
  let frequency = true;
  let binCount = 256;
  var mediaElement;
  let ball, plane, plane2, line, dataArray2;

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
      camera.position.set( 0, 100, 0 );
      camera.lookAt( 0, 0, 0 );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableKeys = false;
      controls.minDistance = 15;
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

      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      dataArray2 = new Uint8Array(bufferLength);
      
      material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      sliceWidth = 500 * 1 / bufferLength;

      function addLine() {
        var geometry = new THREE.Geometry();
        var x = -500/2;
        for(var i = 0; i < bufferLength; i++) {
          geometry.vertices.push(new THREE.Vector3( x, (dataArray[i]-128), 0) );
          x += sliceWidth;
        }
        line = new THREE.Line( geometry, material );
        scene.add( line );
      }

      function addSphere() {
        var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
        var lambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xff00ee,
            wireframe: true
        });
        // var lambertMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
        // var lambertMaterial = new THREE.PointsMaterial({color: 0xff00ee});

        ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
        ball.position.set(0, 0, 0);
        scene.add(ball);
        // console.log(ball.geometry.faces.length, ball.geometry.vertices.length);
      }

      function addPlanes() {
        var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x6904ce,
            side: THREE.DoubleSide,
            wireframe: true
        });

        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 40, 0);
        scene.add(plane);
        
        plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
        plane2.rotation.x = -0.5 * Math.PI;
        plane2.position.set(0, -40, 0);
        scene.add(plane2);
      }

      function addLight(){
        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      // function addGround(){
      //   var groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
      //   geometry = new THREE.PlaneGeometry(2000,1000,bufferLength-1,100);
      //   length = geometry.vertices.length;
        
      //   geometry.computeFaceNormals();
      //   geometry.computeVertexNormals();
      //   var planeMat = new THREE.MeshLambertMaterial( {vertexColors: THREE.FaceColors, side: THREE.DoubleSide}  );
      //   ground = new THREE.Mesh(geometry,planeMat); 

      //   geometry.faces.forEach(function(face){
      //     var val = geometry.vertices[face.c].z / 100
      //     face.color.setHSL(val, 1, 0.5)
      //   });
      //   geometry.colorsNeedUpdate = true;
      //   ground.rotation.x = -Math.PI/2;
      //   // ground.position.x = 200;
      //   ground.position.y = -256;

      //   scene.add(ground);
      // }
      addLight();
      addSphere();
      addLine();
      console.log(line);
      // addGround();
      // console.log(bufferLength, length)

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
    function makeRoughBall(mesh, bassFr, treFr) { 
      mesh.geometry.vertices.forEach(function (vertex, i) {
        var offset = mesh.geometry.parameters.radius;
        var amp = 14;
        var time = window.performance.now(); 
        vertex.normalize();
        var distance = (offset + bassFr) + noise.noise3D(
              vertex.x + time * 0.0007,
              vertex.y + time * 0.0008,
              vertex.z + time * 0.0009
        ) * amp * treFr;
        vertex.multiplyScalar(distance);
        // mesh.color.r = 1;
        // mesh.geometry.faces[i].color.setHSL(distance / 50, 1, 0.5);
      });
      // mesh.geometry.faces.forEach(function(face){
      //   var val = mesh.geometry.vertices[face.c].z / 100
      //   face.color.setHSL(val, 1, 0.5)
      // });
      // mesh.geometry.colorsNeedUpdate = true;
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }
    function makeRoughGround(mesh, distortionFr) {
      mesh.geometry.vertices.forEach(function (vertex, i) {
          var amp = 2;
          var time = Date.now();
          var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
          vertex.z = distance;
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }

    function fractionate(val, minVal, maxVal) {
      return (val - minVal)/(maxVal - minVal);
    } 

    function modulate(val, minVal, maxVal, outMin, outMax) {
      var fr = fractionate(val, minVal, maxVal);
      var delta = outMax - outMin;
      return outMin + (fr * delta);
    }
    
    function avg(arr){
        var total = arr.reduce(function(sum, b) { return sum + b; });
        return (total / arr.length);
    }

    function min(arr){
        return arr.reduce(function(a, b){ return Math.min(a, b); })
    }
    
    function max(arr){
        return arr.reduce(function(a, b){ return Math.max(a, b); })
    }

    function render() {
      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(dataArray2);
      // slice the array into two halves
      var lowerHalfArray = dataArray.slice(0, (dataArray.length/4) - 1);
      var upperHalfArray = 
      dataArray.slice((dataArray.length/4) - 1, dataArray.length - 1);
      // do some basic reductions/normalisations
      var lowerMax = max(lowerHalfArray);
      var lowerAvg = avg(lowerHalfArray);
      var upperAvg = avg(upperHalfArray);
      var lowerMaxFr = lowerMax / lowerHalfArray.length;
      var lowerAvgFr = lowerAvg / lowerHalfArray.length;
      var upperAvgFr = upperAvg / upperHalfArray.length;
      /* use the reduced values to modulate the 3d objects */
      // these are the planar meshes above and below the sphere
      // makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      // makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
      
      // this modulates the sphere's shape.
      for (let i in line.geometry.vertices)
        line.geometry.vertices[i].y = dataArray2[i]-128;
      line.geometry.verticesNeedUpdate = true;

      makeRoughBall(
        ball, 
        modulate(Math.pow(lowerAvgFr, 0.5), 0, 1, 0, 8),
        modulate(upperAvgFr, 0, 1, 0, 4)
      );

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
