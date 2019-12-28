import React from 'react';
import * as THREE from 'three';
let line, line2;

export function addLine(scene, bufferLength) {
  let sliceWidth = 128 * 1 / bufferLength;
  let material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
  let geometry = new THREE.Geometry();
  let x = -128/2;
  for(var i = 0; i < bufferLength; i++) {
    geometry.vertices.push(new THREE.Vector3( x, 0, 0) );
    x += sliceWidth;
  }
  line = new THREE.Line( geometry, material );

  var geometry2 = new THREE.Geometry();
  x = -128/2;
  for(var i = 0; i < bufferLength; i++) {
    geometry2.vertices.push(new THREE.Vector3( 0, 0, x) );
    x += sliceWidth;
  }
  line2 = new THREE.Line( geometry2, material );

  scene.add( line );
  // scene.add( line2 );

  addBoxes(scene);
}

export function addBoxes(scene) {
  const width = 128;
  const height = 128;
  const depth = 12;
  const thresholdAngle = 15;
  const edges = new THREE.EdgesGeometry(
    new THREE.BoxBufferGeometry(width, height, depth),
    thresholdAngle);
  const box = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xf4f7dc } ) );
  const edges2 = new THREE.EdgesGeometry(
    new THREE.BoxBufferGeometry(depth, height, width),
    thresholdAngle);
  const box2 = new THREE.LineSegments( edges2, new THREE.LineBasicMaterial( { color: 0xf4f7dc } ) );

  scene.add( box );
  // scene.add( box2 );
}
let gas = false;
export function updateLine(dataArray) {
  for (let i in line.geometry.vertices) {
    line.geometry.vertices[i].y = (dataArray[i]-128) / 2;
    // line2.geometry.vertices[i].y = (dataArray[i]-128) / 2;
  }
  line.geometry.verticesNeedUpdate = true;
  // line2.geometry.verticesNeedUpdate = true;
}