const express = require('express');
cors = require('cors');
fs = require('fs');
const path = require('path'); // Imported for path.join method wwhen un commented

const matching = require('./templateMatching.js');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Default response to client
let response = {
  status: 'Failed',
  resultImage: null,
  templateImg: null,
  takeoffCount: null,
};

let increment = 0;

// Function to encode file data to base64 encoded string
function fileToBase64(file) {
  let bitmap = fs.readFileSync(file);
  return new Buffer.from(bitmap).toString('base64');
}

// Receives data from client
app.post('/api/send', cors(), (req, res) => {
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
    // Run template matching
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
        console.log(`Error Messege: ${err}`);
      });
  }
  // Ensures the template matching function waits for the Base64 to jpg conversion
  setTimeout(function () {
    templateMatchingFunc();
  }, 20);
});

const port = process.env.PORT || 5001;

// Hide for develompent - keep for docker after updating the react build file to latest version
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(port, () => `Server running on port ${port}`);
