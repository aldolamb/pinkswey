import React from 'react';
import * as THREE from 'three';
let group, sliceWidth, bufferLength, material;

export function addLines(scene, buffer) {
  group = new THREE.Group();
  bufferLength = buffer;
  sliceWidth = 1000 * 1 / bufferLength;
  material = new THREE.MeshBasicMaterial( { color: 0xf4f7dc } );
  scene.add(group);
}

export function updateLines(dataArray) {
  var geometry = new THREE.Geometry();
  var x = -1000/2;
  for(var i = 0; i < bufferLength; i++) {
    geometry.vertices.push(new THREE.Vector3( x, (dataArray[i]-128), 0) );
    x += sliceWidth;
  }
  var line = new THREE.Line( geometry, material );
  group.add( line );

  let len = group.children.length;
  if (len > 100) 
    group.remove(group.children[0]);

  for (let i in group.children)
    group.children[i].position.set(0,0,(len/2 - i) * 10);
}
