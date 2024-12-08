const environment = process.env.NODE_ENV || 'docker';
let cv;

try {
  // For Docker environment
  if (environment === 'docker') {
    cv = require('@u4/opencv4nodejs');
  } 
  // For local development
  else {
    cv = require('@u4/opencv4nodejs');
  }
} catch (error) {
  console.error('Error loading OpenCV:', error);
  process.exit(1);
}

module.exports = {
  templateMatching: async function (draw, template) {
    try {
      // Loads the template image and drawing using async API
      const [drawing, templateImage] = await Promise.all([
        cv.imreadAsync(draw),
        cv.imreadAsync(template)
      ]);

      // Rest of your template matching code...
      const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);
      const items = [];
      let maxVal = null;

      while (true) {
        const minMax = matched.minMaxLoc();
        const { x, y } = minMax.maxLoc;

        if (maxVal === null) {
          maxVal = minMax.maxVal;
        }

        if (minMax.maxVal < maxVal * 0.7) {
          break;
        }

        // Process matching results...
        for (let i = 0; i < templateImage.rows; i++) {
          for (let j = 0; j < templateImage.cols; j++) {
            const tx = x + j - templateImage.cols / 2;
            const ty = y + i - templateImage.rows / 2;
            
            if (ty >= matched.rows || ty < 0) continue;
            if (tx >= matched.cols || tx < 0) continue;
            
            matched.set(ty, tx, 0);
          }
        }

        items.push(x);
        drawing.drawRectangle(
          new cv.Rect(x, y, templateImage.cols, templateImage.rows),
          new cv.Vec(0, 0, 255),
          2,
          cv.LINE_8
        );
      }

      await cv.imwriteAsync('./output/results.jpg', drawing);
      return items.length;
    } catch (error) {
      console.error('Error in template matching:', error);
      throw error;
    }
  },
};
