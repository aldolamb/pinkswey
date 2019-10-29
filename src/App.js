import React, {useRef, useEffect, useState} from 'react';
// import Player from './Player';
// import Analyser from './Analyser';
import Analyser from './AnalyserExperimental';
// import Analyser from './Player2/AnotherTry2';
import Bar from './Bar';
// import Analyser from './Player/Analyser';
import Audio from './Audio';
import GraveyardShift from './assets/GraveyardShift';
import './App.css';

function App() {
  var [entered, setEntered] = useState(false);
  var [loaded, setLoaded] = useState(false);

  function handleClick() {
    setEntered(true);
    
    const audio = document.getElementById("audio");
    audio.play();
    audio.pause();
  }

  return (
    <div className="App">
      {/* {entered ? 
        <div>
          <Player/>
          <Analyser/>
        </div>
        :
        <div className="enter" onClick={() => handleClick()}><GraveyardShift/></div>
      } */}
      {loaded && <Analyser/>}
      {loaded && <Bar/>}
      <Audio setLoaded={setLoaded} />
    </div>
  );
}

export default App;
