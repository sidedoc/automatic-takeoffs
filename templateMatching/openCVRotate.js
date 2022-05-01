const cv = require('opencv4nodejs');

console.log('test');
let src = cv.imread('./drawing.png');

let dst = new cv.Mat();
let dsize = new cv.Size(src.rows, src.cols);
let center = new cv.Point(src.cols / 2, src.rows / 2);
// You can try more different parameters
let M = cv.getRotationMatrix2D(center, 90, 1);
cv.warpAffine(
  src,
  dst,
  M,
  dsize,
  cv.INTER_LINEAR,
  cv.BORDER_CONSTANT,
  new cv.Scalar()
);

cv.imshow('canvasOutput', dst);

src.delete();
dst.delete();
M.delete();
