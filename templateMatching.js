const environment = process.env.NODE_ENV || 'docker';
let cv;

// Initialize cv based on environment
if (environment === 'docker') {
  cv = require('/node_modules/@u4/opencv4nodejs'); // for docker build
} else {
  cv = require('@u4/opencv4nodejs'); // for development
}

module.exports = {
  templateMatching: async function (draw, template) {
    try {
      // Loads the template image and drawing using async API
      const [drawing, templateImage] = await Promise.all([
        cv.imreadAsync(draw),
        cv.imreadAsync(template)
      ]);

      // Runs the template matching
      const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);
      const items = [];
      let maxVal = null;

      while (true) {
        // Keep getting minMax while value still near max
        const minMax = matched.minMaxLoc();
        const { x, y } = minMax.maxLoc;

        if (maxVal === null) {
          maxVal = minMax.maxVal;
        }

        if (minMax.maxVal < maxVal * 0.7) {
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

        // Draw rectangle around matched area
        drawing.drawRectangle(
          new cv.Rect(x, y, templateImage.cols, templateImage.rows),
          new cv.Vec(0, 0, 255),
          2,
          cv.LINE_8
        );
      }

      // Write results and return count
      await cv.imwriteAsync('./output/results.jpg', drawing);
      return items.length;
    } catch (error) {
      console.error('Error in template matching:', error);
      throw error;
    }
  },
};
