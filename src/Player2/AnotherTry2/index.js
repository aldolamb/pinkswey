import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
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

  float convert( in float c )
  {
    return c < 0.5 ? 1.0 : 0.0;
  }

  void main() {
    vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );
    vec3 color = vec3(convert(vUv.y), 1.0, 1.0);
    float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;
    float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );
    // gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
    gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
  }
`;

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  var geometry, length;
  var time = 0;

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
      var mediaElement = new Audio();
      mediaElement.crossOrigin = "anonymous";
      mediaElement.src = document.getElementById('audio').src;
      mediaElement.loop = true;
      mediaElement.play();

      analyser = ctx.createAnalyser();
      audioSrc = ctx.createMediaElementSource(mediaElement);

      audioSrc.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.fftSize = 2 ** 11;

      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      sliceWidth = 1000 * 1 / bufferLength;

      function addLight(){

        //use directional light
        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9);
        // //set the position
        // directionalLight.position.set(10, 2, 20);
        // //enable shadow
        // directionalLight.castShadow = true;
        // //enable camera 
        // directionalLight.shadowCameraVisible = true;
    
        // //add light to the scene
        // scene.add( directionalLight );

        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      function addGround(){

        //create the ground material using MeshLambert Material
        var groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
    
        //create the plane geometry
        geometry = new THREE.PlaneGeometry(120,100,100,100);
        length = geometry.vertices.length;
        //make the terrain bumpy
        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
          var vertex = geometry.vertices[i];
          // var value = (i % 10) + Math.sqrt(i / 2, 2);
          let x = vertex.x;
          let y = vertex.y;
          var value = (x^2+y^3)^0.5;
          // var value = Math.sin(5*x)*Math.cos(5*y)/5 * 200
          // var value = 1/(15*(x^2+y^2)) * 1000
          // var value = Math.sin(10*(x^2+y^2))/10 * 10
          vertex.z = x;
        }
    
        //ensure light is computed correctly
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        let uniforms = {
          tAudioData: { value: new THREE.DataTexture( geometry.vertices, 2 ** 11 / 2, 1, THREE.LuminanceFormat ) }
        };
        var material = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        } );


        //create the ground form the geometry and material
        // var ground = new THREE.Mesh(geometry,material); 
        // var planeMat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
        var planeMat = new THREE.MeshLambertMaterial( {vertexColors: THREE.FaceColors, side: THREE.DoubleSide}  );
        var ground = new THREE.Mesh(geometry,planeMat); 


        geometry.faces.forEach(function(face){
          var val = geometry.vertices[face.a].z;
          // face.color.setRGB(Math.abs(val) / size * 2, 0, 0);
          face.color.setHSL(Math.abs(val) / 100, 1.0, 0.5)
        });
        geometry.colorsNeedUpdate = true;
        //rotate 90 degrees around the xaxis so we can see the terrain 
        ground.rotation.x = -Math.PI/-2;
        
        //add the ground to the scene
        scene.add(ground); 
    
      }
      addLight();
      addGround();

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
      time += 1;

      // geometry.faces.forEach(function(face){
      //   var val = geometry.vertices[face.a] ? geometry.vertices[face.a].z : 0;
      //   // face.color.setRGB(Math.abs(val) / size * 2, 0, 0);
      //   face.color.setHSL(Math.abs(val - time) / 100, 1.0, 0.5)
      // });
      // geometry.faces.forEach(function(face){
      //   var val = geometry.vertices[face.a].z;
      //   // face.color.setRGB(Math.abs(val) / size * 2, 0, 0);
      //   face.color.setHSL(Math.abs(val) / 100, 1.0, 0.5)
      // });
      // geometry.colorsNeedUpdate = true;
      // geometry.vertices = geometry.vertices.slice(1) + geometry.vertices.slice(0,1);

      // geometry.vertices
      // var x, y, z, index;
      // x = y = z = index = 0;
      // geometry.vertices.forEach(function(vertice){
      //   vertice.z = ( Math.random() - 0.5 ) * 30;
      // });
      // if (time % 10 == 0) {
        for (let i = 0; i < length; i++)
          geometry.vertices[i].z = geometry.vertices[(i+1)%length].z;
        geometry.verticesNeedUpdate = true;
      // }
      // analyser.getByteFrequencyData(dataArray);
      // analyser.getByteTimeDomainData(dataArray);
      // var geometry = new THREE.Geometry();
      // var x = -1000/2;
      // for(var i = 0; i < bufferLength; i++) {
      //   geometry.vertices.push(new THREE.Vector3( x, (dataArray[i]-128), 0) );
      //   x += sliceWidth;
      // }
      // var line = new THREE.Line( geometry, material );
      // scene.add( line );

      // let len = scene.children.length;
      // if (len > 100) 
      //   scene.remove(scene.children[0]);

      // for (let i in scene.children)
      //   scene.children[i].position.set(0,0,(len/2 - i) * 10);

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
