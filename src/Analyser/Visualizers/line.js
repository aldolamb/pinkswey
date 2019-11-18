import React from 'react';
import * as THREE from 'three';
let line;

export function addLine(scene, bufferLength) {
  var sliceWidth = 500 * 1 / bufferLength;
  var material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
  var geometry = new THREE.Geometry();
  var x = -500/2;
  for(var i = 0; i < bufferLength; i++) {
    geometry.vertices.push(new THREE.Vector3( x, 0, 0) );
    x += sliceWidth;
  }
  line = new THREE.Line( geometry, material );
  scene.add( line );
}

export function updateLine(dataArray) {
  for (let i in line.geometry.vertices)
    line.geometry.vertices[i].y = dataArray[i]-128;
  line.geometry.verticesNeedUpdate = true;
}