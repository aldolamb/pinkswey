import React, {useEffect, useState}  from 'react';
import { Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let WIDTH = 1000, HEIGHT = 350;
// var latency = 1;
// var mouseDown = false;
var switchUp = false;

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var audio, ctx, analyser, audioSrc, bufferLength, dataArray, frequencyDate;

  let mouseX = 0;
  let did = false;
  var controls;

  useEffect(() => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
    var canvas = document.getElementById("canvas");
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    // var material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    camera.position.set( 0, 0, 1000 );
    camera.lookAt( 0, 0, 0 );
    // camera.position.z = 5;
    // var animate = function () {
    //   requestAnimationFrame( animate );
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01; f
    //   renderer.render( scene, camera );
    // };

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableKeys = false;
    // controls.autoRotate = true;
    controls.minDistance = 150;
    controls.maxDistance = 1500;
    controls.maxPolarAngle = Math.PI / 2;

    audio = document.getElementById('audio');
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    audioSrc = ctx.createMediaElementSource(audio);

    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    frequencyDate = new Uint8Array(analyser.frequencyBinCount);

    analyser.fftSize = 2 ** 11;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    var geometry = new THREE.Geometry();
    var sliceWidth = 1000 * 1 / bufferLength;
    var x = -1000/2;
    for(var i = 0; i < bufferLength; i++) {
      geometry.vertices.push(new THREE.Vector3( x, 0, 0) );
      x += sliceWidth;
    }
    var line = new THREE.Line( geometry, material );
    scene.add( line );
    renderer.render( scene, camera );

    // let count = 0;
    function draw() {
      // latency = document.getElementById('latency');
      var drawVisual = requestAnimationFrame(draw);
      if (switchUp)
        analyser.getByteFrequencyData(dataArray);
      else
        analyser.getByteTimeDomainData(dataArray);
      // console.log(ctx.currentTime)



      var geometry = new THREE.Geometry();
      var x = -1000/2;
      for(var i = 0; i < bufferLength; i++) {
        geometry.vertices.push(new THREE.Vector3( x, (dataArray[i]-128), 0) );
        // geometry.vertices.push(new THREE.Vector3( x, dataArray[i], 0) );
        x += sliceWidth;
      }
      var line = new THREE.Line( geometry, material );
      // line.position.z = count;
      scene.add( line );

      // // var lastIndex = ; endElement = ;
      let len = scene.children.length;
      if (len > 100) {
        scene.remove(scene.children[0]);

      
      for (let i in scene.children)
        scene.children[i].position.set(0,0,(len/2 - i) * 10);
        // if (!did) {
        //   let test = [];
        //   for (let i in scene.children) {
        //     let child = scene.children[i].geometry;
        //     for (let j in child.vertices)
        //       test.push(child.vertices[j].y);
        //   }
        //   console.log(JSON.stringify(test))
        //   did = true;
        // }
      }

      // for (let i in scene.children) {
      //   scene.children[i].position.z = i * 10;
      // }

      // console.log(scene)
      //   if (!did) {
      //     let children = scene.children;
      //     for (let child in children) {
      //       // console.log(children[child])
      //       let vertices = children[child].geometry.vertices;
      //       for (let vertice in children[child].geometry.vertices)
      //         console.log(vertices[vertice])
      //     }
      //     did = true;
      //   }
      // }

      

      
      // for(var i = 0; i < bufferLength; i++) {
      //   line.geometry.vertices[i].y = ((dataArray[i]-128) / 128) * (WIDTH / 2);
      //   line.geometry.vertices[i].z += 1;
      //   // line.geometry.vertices[i].y = dataArray[i];
      // }
      // line.geometry.verticesNeedUpdate = true;
      renderer.render( scene, camera );
      // geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
      // geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
      // animate();
      // camera.lookAt( 0, 0, count - mouseX/4);
      // camera.position.set( WIDTH/8, WIDTH/8 + mouseX/4, 200 + count );
      // controls.center.set(0, 0, count);
      // controls.target.set( 0, 0, count);
      controls.update();
      // camera.position.set( 200, 300, 200+count );
      // count+=10;
    }
    draw();
  }, []);

  // function draw() {
  // };

  return (
    <Visualizer 
      id='canvas' 
      width={WIDTH} 
      height={HEIGHT} 
      // onMouseMove={(e) => mouseX = e.pageX - WIDTH/4} 
      // onMouseDown={() => switchUp = !switchUp}
    />
  );
}

export default AnalyserThree;
