import React, {useRef, useEffect, useState} from 'react';
import Player from './Player';
import Analyser from './Player/AnalyserThree';
import GraveyardShift from './assets/GraveyardShift';
import './App.css';

function App() {
  var [entered, setEntered] = useState(false);

  function handleClick() {
    setEntered(true);
    
    const audio = document.getElementById("audio");
    audio.play();
    audio.pause();
  }

  return (
    <div className="App">
      {entered ? 
        <div>
          <Player/>
          <Analyser/>
        </div>
        :
        <div className="enter" onClick={() => handleClick()}><GraveyardShift/></div>
      }
      <audio id="audio"
        controls
        onCanPlay={() => console.log('Can Play')}
        onCanPlayThrough={() => console.log('Can Play Through')}
        // muted="1"
        
        crossOrigin="anonymous"
        src={"https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996"}
      />
    </div>
  );
}

export default App;
