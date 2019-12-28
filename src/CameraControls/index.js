import React, {useEffect, useState}  from 'react';
import { CameraPresets } from './styled';

const CameraControls = ({
  setCamera
}) => {
  return (
    <CameraPresets>
      <button onClick={() => setCamera( 0, 600 / 4, 0 )}>1</button>
      <button onClick={() => setCamera( 0, 0, -750 / 4 )}>2</button>
      <button onClick={() => setCamera( 750 / 4, 0, 0 )}>3</button>
      <button onClick={() => setCamera( 400 / 4, 500 / 4, 400 / 4 )}>4</button>
    </CameraPresets>
  );
}

export default CameraControls;
