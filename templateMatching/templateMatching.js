// 1. load in opencv4nodejs -> theres a trick to installing this, rewatch youtuube video for this trick
const cv = require('opencv4nodejs');

module.exports = {
  templateMatching: async function (draw, template) {
    // 2. load template and board image - the two file names are hard coded in here. Make sure the files are in the current directory.
    const drawing = await cv.imreadAsync(draw);
    const templateImage = await cv.imreadAsync(template);

    let xresults = [];
    let yresults = [];

    // 3. run template matching
    const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);

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
      xresults.push(x);
      yresults.push(y);
      //var cols = templateImage.cols;
      //var rows = templateImage.rows;

      drawing.drawRectangle(
        new cv.Rect(x, y, templateImage.cols, templateImage.rows),
        new cv.Vec(0, 0, 255),
        2,
        cv.LINE_8
      );
    }
    /////////////////////////// proof of concept

    // const templateImage90 = await cv.imreadAsync(template90);

    // // 3. run template matching
    // const matched90 = drawing.matchTemplate(
    //   templateImage90,
    //   cv.TM_CCOEFF_NORMED
    // );

    // let maxVal90 = null;
    // while (true) {
    //   // 4. keep getting minMax while value still near max
    //   const minMax = matched90.minMaxLoc();
    //   const x = minMax.maxLoc.x;
    //   const y = minMax.maxLoc.y;

    //   if (maxVal90 === null) {
    //     maxVal90 = minMax.maxVal;
    //   }
    //   const value = minMax.maxVal;

    //   if (value < maxVal90 * 0.8) {
    //     break;
    //   }

    //   // 5. Removes results that are right beside the original image
    //   for (let i = 0; i < templateImage90.rows; i++) {
    //     for (let j = 0; j < templateImage90.cols; j++) {
    //       const tx = x + j - templateImage90.cols / 2;
    //       const ty = y + i - templateImage90.rows / 2;
    //       if (ty >= matched90.rows || ty < 0) continue;
    //       if (tx >= matched90.cols || tx < 0) continue;
    //       matched90.set(ty, tx, 0);
    //     }
    //   }

    //   drawing.drawRectangle(
    //     new cv.Rect(x, y, templateImage90.cols, templateImage90.rows),
    //     new cv.Vec(0, 0, 255),
    //     2,
    //     cv.LINE_8
    //   );
    // }

    ////////////////////////
    cv.imwrite('../output/results.png', drawing);
    //cv.imshow('Results', drawing);
    //cv.waitKey();
    //return { drawing, xresults, yresults, cols, rows };
    //return { drawing };
  },
};
