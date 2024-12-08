const environment = process.env.NODE_ENV || 'docker';
if (environment === 'docker') {
  let cv = require('/node_modules/opencv4nodejs'); // for docker build
}
let cv = require('opencv4nodejs'); // for development

module.exports = {
  templateMatching: async function (draw, template) {
    // Loads the template image and drawing
    const [drawing, templateImage] = await Promise.all([
      cv.imreadAsync(draw),
      cv.imreadAsync(template)
    ]);

    // Resize large images to improve performance
    const MAX_WIDTH = 1200;
    let scale = 1;
    if (drawing.cols > MAX_WIDTH) {
      scale = MAX_WIDTH / drawing.cols;
      const newHeight = Math.round(drawing.rows * scale);
      drawing = drawing.resize(MAX_WIDTH, newHeight);
      templateImage = templateImage.resize(
        Math.round(templateImage.cols * scale),
        Math.round(templateImage.rows * scale)
      );
    }

    // Pre-calculate template dimensions
    const templateRows = templateImage.rows;
    const templateCols = templateImage.cols;
    const halfTemplateRows = templateRows / 2;
    const halfTemplateCols = templateCols / 2;

    // Runs the template matching
    const matched = drawing.matchTemplate(templateImage, cv.TM_CCOEFF_NORMED);
    const items = [];
    const matchThreshold = 0.55;
    
    // Get initial maxVal
    const initialMinMax = matched.minMaxLoc();
    let maxVal = initialMinMax.maxVal;

    // Create rectangle parameters once
    const color = new cv.Vec(0, 0, 255);
    const thickness = 2;
    const lineType = cv.LINE_8;

    while (true) {
      // Keep getting minMax while value still near max
      const minMax = matched.minMaxLoc();
      const { x, y, maxVal: value } = { x: minMax.maxLoc.x, y: minMax.maxLoc.y, maxVal: minMax.maxVal };

      if (value < maxVal * matchThreshold) break;

      // Use more efficient array operations for clearing matched areas
      const startY = Math.max(0, Math.floor(y - halfTemplateRows));
      const endY = Math.min(matched.rows, Math.ceil(y + halfTemplateRows));
      const startX = Math.max(0, Math.floor(x - halfTemplateCols));
      const endX = Math.min(matched.cols, Math.ceil(x + halfTemplateCols));

      for (let i = startY; i < endY; i++) {
        const row = matched.getRow(i);
        for (let j = startX; j < endX; j++) {
          row.set(j, 0);
        }
      }

      // Adjust coordinates back to original scale if image was resized
      const originalX = Math.round(x / scale);
      const originalY = Math.round(y / scale);
      const originalWidth = Math.round(templateCols / scale);
      const originalHeight = Math.round(templateRows / scale);

      items.push(originalX);
      drawing.drawRectangle(
        new cv.Rect(originalX, originalY, originalWidth, originalHeight),
        color,
        thickness,
        lineType
      );
    }

    await cv.imwriteAsync('./output/results.jpg', drawing);
    return items.length;
  },
};
