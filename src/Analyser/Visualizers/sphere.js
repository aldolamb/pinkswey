import React from 'react';
import * as THREE from 'three';
var SimplexNoise = require('simplex-noise'),
noise = new SimplexNoise(Math.random);
let ball;
let plane, plane2;

export function addSphere(scene) {
  var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
  var lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0xff00ee,
      wireframe: true
  });
  ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
  ball.position.set(0, 0, 0);
  scene.add(ball);

  // addPlanes(scene);
}

export function updateSphere(dataArray) {
  var lowerHalfArray = dataArray.slice(0, (dataArray.length/8) - 1);
  var upperHalfArray = 
  dataArray.slice((dataArray.length/8) - 1, dataArray.length - 1);
  // do some basic reductions/normalisations
  var lowerMax = max(lowerHalfArray);
  var lowerAvg = avg(lowerHalfArray);
  var upperAvg = avg(upperHalfArray);
  var lowerMaxFr = lowerMax / lowerHalfArray.length;
  var lowerAvgFr = lowerAvg / lowerHalfArray.length;
  var upperAvgFr = upperAvg / upperHalfArray.length;

  makeRoughBall(
    ball, 
    modulate(Math.pow(lowerAvgFr, 0.5), 0, 1, 0, 8),
    modulate(upperAvgFr, 0, 1, 0, 4)
  );

  // updateGround(lowerAvgFr, upperAvgFr);
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





function addPlanes(scene) {
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

function updateGround(lowerMaxFr, upperAvgFr) {
  makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
  makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
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