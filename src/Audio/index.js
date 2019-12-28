import React, {useEffect, useState}  from 'react';
import GraveyardShift2 from "../assets/GraveyardShift2.mp3"
import firebase from '../config/firebase.js';

const Audio = ({setLoaded}) => {

  // const [url, setUrl] = useState("https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996");
  // const [url, setUrl] = useState("https://api-v2.soundcloud.com/media/soundcloud:tracks:468716610/4c3ee7db-45e0-47c1-9158-d8706f7493d2/stream/hls?client_id=YUKXoArFcqrlQn9tfNHvvyfnDISj04zk");
  const [url, setUrl] = useState("https://us-central1-pinkswey-54084.cloudfunctions.net/helloWorld");

  useEffect(() => {
    async function init() {
      let source = await fetch("https://us-central1-pinkswey-54084.cloudfunctions.net/helloWorld")
        .then(response => response.json())
        .then(response => {
          console.log(response.message); return response.message;     
        })
        .catch(error => console.log("ERROR" + error));
      await setUrl(source);

      // setUrl(GraveyardShift2);
      setLoaded(true);
    }
    init();
  }, [])

  return (
    <audio id="audio"
      style={{display: "none"}}
      crossOrigin="anonymous"
      src={url}
    />
  );
}

export default Audio;
