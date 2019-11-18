import React, {useEffect, useState}  from 'react';
import { Overlay, Visualizer } from './styled';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from '../CameraControls';
import { Camera } from 'three';
var SimplexNoise = require('simplex-noise'),
noise = new SimplexNoise(Math.random);

let vertexShader = `
varying vec3  pos;
varying float mapH;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

#define OCTAVES 8
float fbm ( vec2 st) {
    // Initial values
    float value = 0.;
    float amplitud = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * noise(st);
        st *= 2.1;
        amplitud *= .6;
    }
    return value;
}

float pattern( in vec2 p )
  {
      vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                     fbm( p + vec2(5.2,1.3) ) );

      vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                     fbm( p + 4.0*q + vec2(8.3,2.8) ) );

      return fbm( p + 4.0*r );
  }

void main()
{
    pos         = position;
    mapH        = pos.y;
    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + mapH*.035, 1.0);
}
`

let fragmentShader = `
varying vec3  pos;
varying float mapH;

vec3 HeightToRGB(in float H)
{
    float B = abs(H * 5.0 - 3.0) - 1.0;
    float G = 2.0 - abs(H * 5.0 - 2.0);
    float R = 2.0 - abs(H * 5.0 - 4.0);
    B = H * 10.0;
    G = H * 10.0;
    R = H * 10.0;
    return vec3(R,G,B);
    // return clamp( vec3(R,G,B), 0.0, 1.0 );
}

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main()
{
    // vec3 color = HeightToRGB( mapH );
		// vec3 color = vec3((pos.x + 500.0) / 1000.0, (pos.y + 500.0) / 1000.0, (pos.z + 500.0) / 1000.0);
		vec3 color = vec3((pos.y + 500.0) / 1000.0, (pos.y + 500.0) / 1000.0, (pos.y + 500.0) / 1000.0);
    gl_FragColor = vec4( hsl2rgb(color), 1.0 );
}`

const AnalyserThree = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var scene, camera, renderer, analyser, uniforms, controls;
  var audioSrc, ctx, frequencyData, bufferLength, dataArray, sliceWidth, material;
  const size = 500;
  var particleSystem, uniforms, geometry, shaderMaterial;
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
      
      // material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
      material = new THREE.ShaderMaterial( {
        uniforms:     uniforms,
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader,
        transparent:  true
      });
      material.needsUpdate = true;
      sliceWidth = 1000 * 1 / bufferLength;

      function addParticles() {
        var particles = 256 * 256 * 3;
				var geometry = new THREE.BufferGeometry();
				var positions = [];
				var colors = [];
				var color = new THREE.Color();
        var n = 1000, n2 = n / 2; // particles spread in the cube
        for (let i = 0; i < 512; i++) {
          for (let k = 0; k < 256; k++) {
					  positions.push( i, 0, k );
          }
        }
				// for ( var i = 0; i < particles; i ++ ) {
				// 	// positions
				// 	var x = Math.random() * n - n2;
				// 	var y = Math.random() * n - n2;
				// 	var z = Math.random() * n - n2;
				// 	positions.push( x, y, z );
				// 	// colors
				// 	var vx = ( x / n ) + 0.5;
				// 	var vy = ( y / n ) + 0.5;
				// 	var vz = ( z / n ) + 0.5;
				// 	color.setRGB( vx, vy, vz );
				// 	colors.push( color.r, color.g, color.b );
        // }
        geometry.attributes['position'] = new THREE.Float32BufferAttribute( positions, 3);
        // geometry.attributes['color'] = new THREE.Float32BufferAttribute( colors, 3 );
        var alphas = new Float32Array( particles ); // 1 values per vertex
        for( var i = 0; i < particles; i ++ ) {
          // set alpha randomly
          alphas[ i ] = Math.random();
        }
       
        geometry.attributes['alpha'] = new THREE.BufferAttribute( alphas, 1 );
				// geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
				// geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				geometry.computeBoundingSphere();
				//
        // var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );
        material = new THREE.ShaderMaterial( {

          uniforms: {
            color: { value: new THREE.Color( 0xffff00 ) },
          },
        
          vertexShader: vertexShader,
        
          fragmentShader: fragmentShader,
        
        } );
        particleSystem = new THREE.Points( geometry, material );
        particleSystem.position.x = -256;
        particleSystem.position.y = -63;
        particleSystem.position.z = -127;
				scene.add( particleSystem );
      }

      function addSphere() {
        uniforms = {
					pointTexture: { value: new THREE.TextureLoader().load( "textures/sprites/spark1.png" ) }
        };
        
			  var particles = 1000;
				shaderMaterial = new THREE.ShaderMaterial( {
					uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() }
          },
					vertexShader: vertexShader,
					fragmentShader: fragmentShader,
					blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true,
					vertexColors: true
				} );
				var radius = 200;
				geometry = new THREE.BufferGeometry();
				var positions = [];
				var colors = [];
				var sizes = [];
				var color = new THREE.Color();
				for ( var i = 0; i < particles; i ++ ) {
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					positions.push( ( Math.random() * 2 - 1 ) * radius );
					color.setHSL( i / particles, 1.0, 0.5 );
					colors.push( color.r, color.g, color.b );
					sizes.push( 20 );
        }
        // geometry.attributes['position'] = new THREE.Float32BufferAttribute( positions, 3 );
        // geometry.attributes['color'] = new THREE.Float32BufferAttribute( colors, 3 );
        // geometry.attributes['size'] = new THREE.Float32BufferAttribute( sizes, 1 );
				// geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
				// geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				// geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );
				particleSystem = new THREE.Points( geometry, shaderMaterial );
				scene.add( particleSystem );
      }

      function addLight(){
        var light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
      }

      addLight();
      // addSphere();
      addParticles();

      window.addEventListener( 'resize', onResize, false );
      animate();
    }
    function onResize() {
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function animate() {
      render();
      material.needsUpdate = true;
      requestAnimationFrame( animate );
    }
    function makeRoughBall(points, bassFr, treFr) { 
      points.geometry.attributes.position.array.forEach(function (vertex, i) {
        var amp = 14;
        var time = window.performance.now(); 
        // vertex.normalize();
        var distance = (20 + bassFr) + noise.noise3D(
              vertex.x + time * 0.0007,
              vertex.y + time * 0.0008,
              vertex.z + time * 0.0009
        ) * amp * treFr;
        // vertex.multiplyScalar(distance);
      });
      points.geometry.verticesNeedUpdate = true;
      points.geometry.normalsNeedUpdate = true;
      points.geometry.computeVertexNormals();
      points.geometry.computeFaceNormals();
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

    function test(particleSystem, bassFr, treFr) {
      // var time = Date.now() * 0.001;
      // particleSystem.rotation.x = time * 0.25;
      // particleSystem.rotation.y = time * 0.5; 
      // console.log(particleSystem);

      let positions = particleSystem.geometry.attributes.position.array;
      for (let i = 512 * 256 * 3 - 2; i >= 256 * 3; i-=3)
        positions[i] = positions[i-(256 * 3)];
      let j = 0;
      for (let i = 1; i <= 256 * 3; i += 3) {
        // particleSystem.geometry.attributes.position.array[i] = (20 + bassFr) + (1400 * treFr);
        positions[i] = dataArray[j++ % bufferLength];
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.colorsNeedUpdate = true;
      // points.geometry.attributes.position.array.forEach(function (vertex, i) {
      //   var amp = 14;
      //   var time = window.performance.now(); 
      //   // vertex.normalize();
      //   var distance = (20 + bassFr) + noise.noise3D(
      //         vertex.x + time * 0.0007,
      //         vertex.y + time * 0.0008,
      //         vertex.z + time * 0.0009
      //   ) * amp * treFr;
      //   // vertex.multiplyScalar(distance);
      // });
      particleSystem.geometry.verticesNeedUpdate = true;
      particleSystem.geometry.normalsNeedUpdate = true;
      particleSystem.geometry.computeVertexNormals();
      particleSystem.geometry.computeFaceNormals();

      // var pCount = 10000;
      // while (pCount--) {

      //   // get the particle
      //   var particle =
      //     particleSystem.vertices[pCount];

      //   // check if we need to reset
      //   if (particle.position.y < -200) {
      //     particle.position.y = 200;
      //     particle.velocity.y = 0;
      //   }

      //   // update the velocity with
      //   // a splat of randomniz
      //   particle.velocity.y -= Math.random() * .1;

      //   // and the position
      //   particle.position.addSelf(
      //     particle.velocity);
      // }

      // // flag to the particle system
      // // that we've changed its vertices.
      // particleSystem.
      //   geometry.
      //   __dirtyVertices = true;
    }

    function render() {
      analyser.getByteFrequencyData(dataArray);
      // analyser.getByteTimeDomainData(dataArray);
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
      // makeRoughBall(
      //   particleSystem, 
      //   modulate(Math.pow(lowerAvgFr, 0.5), 0, 1, 0, 8),
      //   modulate(upperAvgFr, 0, 1, 0, 4)
      // );
      test(particleSystem,
        modulate(Math.pow(lowerAvgFr, 0.5), 0, 1, 0, 8),
        modulate(upperAvgFr, 0, 1, 0, 4));

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
