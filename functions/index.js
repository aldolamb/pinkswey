const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
//  response.send("Hello from Firebase!");
  // const url = "https://api.soundcloud.com/tracks/468716610/stream?client_id=1zsDz22qtfrlBg2rdkko9EahD3GiJ996";
  // const url = "https://api-v2.soundcloud.com/media/soundcloud:tracks:468716610/4c3ee7db-45e0-47c1-9158-d8706f7493d2/stream/hls?client_id=YUKXoArFcqrlQn9tfNHvvyfnDISj04zk";
  const url = "https://api-v2.soundcloud.com/media/soundcloud:tracks:468716610/4c3ee7db-45e0-47c1-9158-d8706f7493d2/stream/progressive?client_id=YUKXoArFcqrlQn9tfNHvvyfnDISj04zk";
  
  cors(req, res, () => {
    // if (req.method !== "GET") {
    //   return res.status(401).json({
    //     message: "Not allowed"
    //   });
    // }

    return axios.get(url)
      .then(response => {
        console.log("Success:", response.data);
        return res.status(200).json({
          message: response.data.url
        })
      })
      .catch(err => {
        console.log("Error: ", err);
        return res.status(500).json({
          error: err
        })
      })
  })
});
