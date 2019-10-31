import React, {useEffect, useState}  from 'react';
import { CameraPresets } from './styled';

const CameraControls = ({
  setCamera
}) => {
  return (
    <CameraPresets>
      <button onClick={() => setCamera( 0, 1200, 0 )}>1</button>
      <button onClick={() => setCamera( 0, 0, -1500 )}>2</button>
      <button onClick={() => setCamera( 1500, 0, 0 )}>3</button>
      <button onClick={() => setCamera( 800, 1000, 800 )}>4</button>
    </CameraPresets>
  );
}

export default CameraControls;

{/* <ControlPanel>
<table>
  <tbody>
    <tr>
      <td>
        Data Type<br/>
        Frequency
        <input onChange={() => {frequency = true; ground.position.x = 200;}} type="radio" name="myRadios" value="1" defaultChecked/><br/>
        Time
        <input onChange={() => {frequency = false; ground.position.x = 0;}} type="radio" name="myRadios" value="2" />
      </td>
    </tr>
    <tr>
      <td>
        Camera Positions<br/>
        <button onClick={() => {camera.position.set( 0, 1200, 0 );} }>1</button>
        <button onClick={() => {camera.position.set( 0, 0, -1500 );} }>2</button>
        <button onClick={() => {camera.position.set( 1500, 0, 0 );} }>3</button>
        <button onClick={() => {camera.position.set( 800, 1000, 800 );} }>4</button>
      </td>
    </tr>
    <tr>
      <td>
        Auto Rotate<br/>
        <input onChange={(e) => {controls.autoRotate = e.target.checked;}} type="checkbox" name="rotate" value="1"/>
      </td>
    </tr>
  </tbody>
</table>
</ControlPanel> */}