// Original Youtube Video that runs through the code https://www.youtube.com/watch?v=2LK5FNtrY5w

// 1. load in opencv4nodejs -> theres a trick to installing this, rewatch youtuube video for this trick
const cv = require('opencv4nodejs');

(async () => {
  // 2. load template and board image - the two file names are hard coded in here. Make sure the files are in the current directory.
  const drawing = await cv.imreadAsync('./drawing.png');
  const templateImage = await cv.imreadAsync('./fusedSpur.png');

  // 3. run template matching
  const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);

  let count = [];

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

    if (value < maxVal * 0.8) {
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
    count.push(x);

    // 6. draw a rectangle where match was found on original image
    drawing.drawRectangle(
      new cv.Rect(x, y, templateImage.cols, templateImage.rows),
      new cv.Vec(0, 0, 255),
      2,
      cv.LINE_8
    );
  }
  console.log('The total number of matches is:', count.length);

  // 7. show the image
  // cv.imwrite('results.png', drawing);
  cv.imshow('Results', drawing);
  cv.waitKey();
})();
