'use strict'

/* IMPORT MODULES */
const cv = require('opencv4nodejs')
const MotionDetector = require('./motionDetector')
const moment = require('moment')

const time = () => {
  moment.locale()
  return moment().format('h:mm:ss')
}

class Stream {
  constructor (id, name, address, logger) {
    this.id = id
    this.name = name
    this.address = address
    this.motionDetector = new MotionDetector()
    this.logger = logger
    this.currentEvent = null
    this.events = []
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

    if (this.motionDetector.isMotion(frame)) {
      //  create current event
      if (!this.currentEvent) {
        this.currentEvent = {
          type: 'motion',
          message: 'Motion Detected',
          startTime: time(),
          endTime: 'Now'
        }
      }

      // frame.drawCircle(new cv.Point2(20, 20), 5, new cv.Vec(219, 152, 52), 10)
    } else if (this.currentEvent) {
      // end event
      this.currentEvent.endTime = time()
      this.logger.info('Event Completed', { id: this.id, name: this.name, address: this.address, event: this.currentEvent })
      this.events.unshift(this.currentEvent)
      this.currentEvent = null
    }

    const encodedFrame = cv.imencode('.jpg', frame).toString('base64')
    return encodedFrame
  }
}

module.exports = Stream
