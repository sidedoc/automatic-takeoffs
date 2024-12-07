const environment = process.env.NODE_ENV || 'docker';

if (environment === 'docker') {
  let cv = require('/node_modules/opencv4nodejs'); // for docker build
}

let cv = require('opencv4nodejs'); // for development

module.exports = {
  templateMatching: async function (draw, template) {
    // Loads the template image and drawing
    const drawing = await cv.imreadAsync(draw);
    const templateImage = await cv.imreadAsync(template);

    // Runs the template matching
    const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);

    let items = [];

    let maxVal = null;
    while (true) {
      // Keep getting minMax while value still near max
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

      // Removes results that are right beside the original image - avoids near duplications
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
    return count;
  },
};
