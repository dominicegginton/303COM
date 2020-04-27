'use strict'

/* IMPORT MODULES */
const cv = require('opencv4nodejs')
const MotionDetector = require('./motionDetector')
const FacialRecognition = require('./facialRecognition')
const moment = require('moment')

const time = () => {
  moment.locale()
  return moment().format('h:mm:ss')
}

class Stream {
  constructor (id, name, address, db, logger) {
    return (async () => {
      this.id = id
      this.name = name
      this.address = address
      this.motionDetector = new MotionDetector()
      this.facialRecognition = await new FacialRecognition(db)
      this.logger = logger
      this.currentEvent = null
      this.events = []
      try {
        this.capture = new cv.VideoCapture(this.address)
      } catch (error) {
        if (error === 'VideoCapture::New - failed to open capture') throw Error('can not connected to camera')
      }
      return this
    })()
  }

  async frame () {
    // capture frame from opencv camera
    let frame = this.capture.read()
    // resize frame
    frame = frame.resizeToMax(640)
    // detect motion
    if (this.motionDetector.isMotion(frame)) {
      //  create new event
      if (!this.currentEvent) {
        this.currentEvent = {
          type: 'motion',
          message: 'Motion Detected',
          startTime: time(),
          endTime: 'Now'
        }
      }
      // detect and recognize faces in frame
      const result = await this.facialRecognition.process(frame)
      const matchedFaces = result[0]
      frame = result[1]
      // if faces found in frame
      if (matchedFaces) {
        const recognizedFaces = matchedFaces.filter(face => face._label !== 'unknown')
        if (recognizedFaces.length > 0) {
          // create safe event
          this.currentEvent.type = 'safe'
          this.currentEvent.message = 'Safe'
        } else {
          // threat detected
          if (this.currentEvent.type !== 'safe') {
            this.currentEvent.type = 'threat'
            this.currentEvent.message = 'Threat Detected'
          }
        }
      }
      // end event
    } else if (this.currentEvent) {
      this.currentEvent.endTime = time()
      this.logger.info('Event Completed', { id: this.id, name: this.name, address: this.address, event: this.currentEvent })
      this.events.unshift(this.currentEvent)
      this.currentEvent = null
    }
    // return encoded jpeg
    const encodedFrame = cv.imencode('.jpg', frame).toString('base64')
    return encodedFrame
  }
}

module.exports = Stream
