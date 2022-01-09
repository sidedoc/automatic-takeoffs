const express = require('express');
cors = require('cors');
fs = require('fs');
const path = require('path'); // gets the path.join method working for heroku

const matching = require('./templateMatching.js');

const app = express();
app.use(express.json({ limit: '10mb' })); // changed from 1mb to 10mb due to size of ImageToCrop

// default response to client
let response = {
  status: 'Failed',
  resultImage: null,
  takeoffCount: null,
};

// function to encode file data to base64 encoded string
function fileToBase64(file) {
  // read binary data
  let bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer.from(bitmap).toString('base64');
}

// receives data from client + console.logs
app.post('/api/send', cors(), (req, res) => {
  // console.log(req.body);

  let templateImage = req.body.templateImage.replace(/^data:image\/\w+;base64,/, '');
  let image = req.body.image.replace(/^data:image\/\w+;base64,/, '');

  fs.writeFile(
    './input/templateImage.jpg',
    templateImage,
    { encoding: 'base64' },
    function (err) {}
  );
  fs.writeFile('./input/constructionDrawing.jpg', image, { encoding: 'base64' }, function (err) {});

  function templateMatchingFunc() {
    // run template matching
    (async () => {
      const templateMatchingOutput = await matching.templateMatching(
        './input/constructionDrawing.jpg',
        './input/templateImage.jpg'
      );
      response.takeoffCount = templateMatchingOutput;
    })();
    response.status = 'Success';
  }
  // ensures the template matching function waits for the Base64 to jpg conversion
  setTimeout(function () {
    templateMatchingFunc();
  }, 0);

  setTimeout(function () {
    response.resultImage = 'data:image/jpeg;base64,' + fileToBase64('./output/results.jpg');
    res.json(response);
  }, 1000); // eventually change this to happen straight after rather than after a set time.
});

// sends the results array to the client on a GET request
app.get('/api/templatematching', cors(), (req, res) => {
  const results = [
    {
      id: 1,
      image: 'image/blob/URL/here',
      templateImage: 'template/image/blob/URL/here',
      takeoffCount: '100',
    },
    {
      id: 2,
      image: 'image/blob2/URL/here',
      templateImage: 'template/image/blob2/URL/here',
      takeoffCount: '40',
    },
  ];

  res.json(results);
});

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('../client-app/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }
const port = process.env.PORT || 5001; // the or logic is heroku

//heroku
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => `Server running on port ${port}`);
