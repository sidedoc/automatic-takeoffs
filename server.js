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
  templateImg: null,
  takeoffCount: null,
};

let increment = 0;

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
    matching
      .templateMatching('./input/constructionDrawing.jpg', './input/templateImage.jpg')
      .then((result) => {
        response.takeoffCount = result;
        response.status = 'Success';
        response.resultImage = 'data:image/jpeg;base64,' + fileToBase64('./output/results.jpg');
        response.templateImg =
          'data:image/jpeg;base64,' + fileToBase64('./input/templateImage.jpg');
        res.json(response);
      })
      .catch((err) => {
        //response.status = 'Failed';
        // res.json(response);
        console.log(`Error Messege: ${err}`);
      });
  }
  // ensures the template matching function waits for the Base64 to jpg conversion
  setTimeout(function () {
    templateMatchingFunc();
  }, 20); // this was originally 0, 20 seems to make it work more consitantly
});

const port = process.env.PORT || 5001; // the or logic is heroku

// hide for develompent - keep for docker after updating the react build file to latest version
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(port, () => `Server running on port ${port}`);
