// import jimp library to the environment
var Jimp = require('jimp');

// User-Defined Function to read the images
// to use without modeul.exports: async function rotate4times(originalImage){...
module.exports = {
  rotate4times: async function (originalImage) {
    const image = await Jimp.read(originalImage);

    // rotates Function - add 90 to the filename
    image.rotate(90).write(`${originalImage.replace(/\.[^/.]+$/, '')}270.png`);
    image.rotate(180).write(`${originalImage.replace(/\.[^/.]+$/, '')}90.png`);
    image.rotate(270).write(`${originalImage.replace(/\.[^/.]+$/, '')}180.png`);
  },
};

// const fileName = './fusedSpur.png';
// rotate4times(fileName);

// console.log('Image Processing Completed');
