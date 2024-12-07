const environment = process.env.NODE_ENV || 'docker';
// Consolidate the cv require statement
const cv = require('opencv4nodejs');

module.exports = {
  templateMatching: async function (draw, template) {
    try {
      // Load images in parallel using Promise.all
      const [drawing, templateImage] = await Promise.all([
        cv.imreadAsync(draw),
        cv.imreadAsync(template)
      ]);

      const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);
      const items = [];
      
      // Pre-calculate values used in the loop
      const halfCols = templateImage.cols / 2;
      const halfRows = templateImage.rows / 2;
      const threshold = 0.7;
      
      // Create rectangle parameters once
      const rect = {
        width: templateImage.cols,
        height: templateImage.rows,
        color: new cv.Vec(0, 0, 255),
        thickness: 2,
        lineType: cv.LINE_8
      };

      let firstMaxVal = null;
      
      while (true) {
        const { maxVal, maxLoc: { x, y } } = matched.minMaxLoc();
        
        if (firstMaxVal === null) {
          firstMaxVal = maxVal;
        } else if (maxVal < firstMaxVal * threshold) {
          break;
        }

        // Use typed arrays and direct memory access for faster iteration
        const rows = new Int32Array(templateImage.rows);
        const cols = new Int32Array(templateImage.cols);
        
        // Batch the pixel updates using a single operation where possible
        const updateRegion = matched.getRegion(
          new cv.Rect(
            Math.max(0, x - halfCols),
            Math.max(0, y - halfRows),
            Math.min(matched.cols - x + halfCols, templateImage.cols),
            Math.min(matched.rows - y + halfRows, templateImage.rows)
          )
        );
        updateRegion.fill(0);
        
        items.push(x);
        
        // Draw rectangle
        drawing.drawRectangle(
          new cv.Rect(x, y, rect.width, rect.height),
          rect.color,
          rect.thickness,
          rect.lineType
        );
      }

      await cv.imwriteAsync('./output/results.jpg', drawing);
      return items.length;
      
    } catch (error) {
      console.error('Template matching error:', error);
      throw error;
    }
  }
};
