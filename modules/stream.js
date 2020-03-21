'use strict'

const cv = require('opencv4nodejs')

class Stream {
  constructor (id, name, address) {
    this.id = id
    this.name = name
    this.address = address
    this.capture = new cv.VideoCapture(this.address)
    this.capture.set(cv.CAP_PROP_FRAME_WIDTH, 600)
    this.capture.set(cv.CAP_PROP_FRAME_HEIGHT, 600)
  }

  frame () {
    return this.capture.read()
  }
}

module.exports = Stream
