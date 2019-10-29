import React, {useEffect, useState}  from 'react';

const Audio = ({setLoaded}) => {

  const [url, setUrl] = useState("https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996");

  useEffect(() => {
    async function init() {
      let source = await fetch(url)
        .then(response => { return response.url; })
        .catch(error => console.log(error));
      await setUrl(source);
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
