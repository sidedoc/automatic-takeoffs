// 1. load in opencv4nodejs -> theres a trick to installing this, rewatch youtuube video for this trick
const cv = require('opencv4nodejs'); // use for development
//const cv = require('/node_modules/opencv4nodejs'); // for docker build

module.exports = {
  templateMatching: async function (draw, template) {
    // 2. load template and board image - the two file names are hard coded in here. Make sure the files are in the current directory.
    const drawing = await cv.imreadAsync(draw);
    const templateImage = await cv.imreadAsync(template);

    // 3. run template matching
    const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);

    let items = [];

    let maxVal = null;
    while (true) {
      // 4. keep getting minMax while value still near max
      const minMax = matched.minMaxLoc();
      const x = minMax.maxLoc.x;
      const y = minMax.maxLoc.y;

      if (maxVal === null) {
        maxVal = minMax.maxVal;
      }
      const value = minMax.maxVal;

      if (value < maxVal * 0.7) {
        break;
      }

      // 5. Removes results that are right beside the original image
      for (let i = 0; i < templateImage.rows; i++) {
        for (let j = 0; j < templateImage.cols; j++) {
          const tx = x + j - templateImage.cols / 2;
          const ty = y + i - templateImage.rows / 2;
          if (ty >= matched.rows || ty < 0) continue;
          if (tx >= matched.cols || tx < 0) continue;
          matched.set(ty, tx, 0);
        }
      }

      // Pushes each matches x axis position value to the array count
      items.push(x);

      drawing.drawRectangle(
        new cv.Rect(x, y, templateImage.cols, templateImage.rows),
        new cv.Vec(0, 0, 255),
        2,
        cv.LINE_8
      );
    }
    const count = items.length;

    cv.imwrite('./output/results.jpg', drawing);
    //cv.imshow('Results', drawing);
    //cv.waitKey();
    return count;
  },
};
