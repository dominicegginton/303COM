'use strict'

/* IMPORT MODULES */
const cv = require('opencv4nodejs')

class MotionDetector {
  constructor () {
    this.MOG = new cv.BackgroundSubtractorMOG2(50, 50, true)
  }

  isMotion (frame) {
    const frameGray = frame.bgrToGray().gaussianBlur(new cv.Size(5, 5), 5)
    const frameMOG = this.MOG.apply(frameGray)
    if (cv.countNonZero(frameMOG) > 2000) return true
    else return false
  }
}

module.exports = MotionDetector
