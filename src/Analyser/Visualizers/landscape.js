import React from 'react';
import * as THREE from 'three';
let geometry, bufferLength, ground, length;

export function addLandscape(scene, bl){
  bufferLength = bl;
  var groundMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide}  );
  geometry = new THREE.PlaneGeometry(2000,1000,bufferLength-1,100);
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
  // ground.position.x = 200;
  ground.position.y = -256;

  scene.add(ground);
}

export function updateLandscape(dataArray) {
  for (let i = length-1; i >= bufferLength; i--)
    geometry.vertices[i].z = geometry.vertices[i-bufferLength].z;
  for (let i = 0; i < bufferLength; i++)
    geometry.vertices[i].z = (dataArray[i] * 2);
  geometry.verticesNeedUpdate = true;

  geometry.faces.forEach(function(face){
    var val = 1.2 - (geometry.vertices[face.a].z / 400);
    // face.color.setHSL(val, 1.0, 0.5)
    face.color.setHSL(val, 1.0, val < .8 ? 0.4 - val/2 : 0)
    // face.color.setHSL(val, 1.0, val < .8 ? 0.4 : 0)
  });
  geometry.colorsNeedUpdate = true;
}