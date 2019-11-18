import React from 'react';
import * as THREE from 'three';
let material, particleSystem;

export function addParticles(scene) {

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

export function updateParticles(dataArray, bufferLength) {
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
`;

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
  }
`;