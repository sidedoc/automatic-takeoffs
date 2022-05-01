const fs = require('fs');
const path = require('path');
const Pdf2Img = require('node-pdf2img-promises');

module.exports = {
  pdf2jpg: function (pdfName) {
    let input = __dirname + pdfName;
    let fileName = pdfName.replace(/\.[^/.]+$/, '');

    let converter = new Pdf2Img();

    // The event emitter is emitting to the file name
    converter.on(fileName, (msg) => {
      console.log('Received: ', msg);
    });

    converter.setOptions({
      type: 'jpg', // png or jpg, default jpg
      size: 4096, // default 1024-bad, 2048-little better, 4096-very good
      density: 600, // default 600
      quality: 100, // default 100
      outputdir: __dirname + path.sep + 'jpgOutput', // output folder, default null (if null given, then it will create folder name same as file name)
      outputname: fileName, // output file name, dafault null (if null given, then it will create image name same as input name)
      page: null, // convert selected page, default null (if null given, then it will convert all pages)
    });

    converter
      .convert(input)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
