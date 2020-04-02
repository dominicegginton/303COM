'use strict'

const cv = require('opencv4nodejs')

class Stream {
  constructor (id, name, address) {
    this.id = id
    this.name = name
    this.address = address
    try {
      this.capture = new cv.VideoCapture(this.address)
      this.capture.set(cv.CAP_PROP_FRAME_WIDTH, 640)
      this.capture.set(cv.CAP_PROP_FRAME_HEIGHT, 480)
    } catch (error) {
      if (error === 'VideoCapture::New - failed to open capture') throw Error('can not connected to camera')
    }
  }

  async frame () {
    let frame = this.capture.read()
    frame = frame.resizeToMax(640)
    const encodedFrame = cv.imencode('.jpg', frame).toString('base64')
    return encodedFrame
  }
}

module.exports = Stream
