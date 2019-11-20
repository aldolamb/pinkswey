import React, {useEffect, useState}  from 'react';
import { CameraPresets } from './styled';

const CameraControls = ({
  setCamera
}) => {
  return (
    <CameraPresets>
      <button onClick={() => setCamera( 0, 600, 0 )}>1</button>
      <button onClick={() => setCamera( 0, 0, -750 )}>2</button>
      <button onClick={() => setCamera( 750, 0, 0 )}>3</button>
      <button onClick={() => setCamera( 400, 500, 400 )}>4</button>
    </CameraPresets>
  );
}

export default CameraControls;
