import React, {useRef, useEffect, useState} from 'react';
import Analyser from './AnalyserSphere';
import Bar from './Bar';
import Audio from './Audio';
import GraveyardShift from './assets/GraveyardShift';
import Navbar from './Navbar';
import './App.css';

function App() {
  var [loaded, setLoaded] = useState(false);
  
  return (
    <div className="App">
      <Navbar/>
      {loaded && <Analyser/>}
      {loaded && <Bar/>}
      <Audio setLoaded={setLoaded} />
    </div>
  );
}

export default App;
