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

    // Pre-calculate template dimensions to avoid repeated access
    const templateRows = templateImage.rows;
    const templateCols = templateImage.cols;

    // Runs the template matching
    const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);
    let items = [];
    let maxVal = null;

    // Create rectangle parameters once outside the loop
    const color = new cv.Vec(0, 0, 255);
    const thickness = 2;
    const lineType = cv.LINE_8;

    while (true) {
      // Keep getting minMax while value still near max
      const minMax = matched.minMaxLoc();
      const x = minMax.maxLoc.x;
      const y = minMax.maxLoc.y;
      if (maxVal === null) {
        maxVal = minMax.maxVal;
      }
      const value = minMax.maxVal;
      if (value < maxVal * 0.55) {
        break;
      }

      // Removes results that are right beside the original image - avoids near duplications
      for (let i = 0; i < templateRows; i++) {
        for (let j = 0; j < templateCols; j++) {
          const tx = x + j - templateCols / 2;
          const ty = y + i - templateRows / 2;
          if (ty >= matched.rows || ty < 0) continue;
          if (tx >= matched.cols || tx < 0) continue;
          matched.set(ty, tx, 0);
        }
      }

      // Pushes each matches x axis position value to the array count
      items.push(x);
      drawing.drawRectangle(
        new cv.Rect(x, y, templateCols, templateRows),
        color,
        thickness,
        lineType
      );
    }

    const count = items.length;
    await cv.imwriteAsync('./output/results.jpg', drawing);
    return count;
  },
};
