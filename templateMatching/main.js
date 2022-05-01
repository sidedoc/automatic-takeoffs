// imports function from another file
//const rotate = require('./jimpRotate.js');

const matching = require('./templateMatching.js');

const cv = require('opencv4nodejs');

//const pdf2jpg = require('./pdftojpeg.js');

//rotate.rotate4times('./fusedSpur.png');

//pdf2jpg.pdf2jpg('/lights.pdf');

// How to do a return in a async function
// (async () => {
//   console.log(
//     await matching.templateMatching('./drawing.png', './fusedSpur.png')
//   );
// })();

(async () => {
  const x = await matching.templateMatching(
    './lights.png',
    './lightsTemplate.png',
    './fusedSpur90.png'
  );
  cv.imshow('Results', x);
  cv.waitKey();
})();
