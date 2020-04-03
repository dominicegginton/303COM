'use strict'

/* IMPORT MODULES */
const Cameras = require('../modules/cameras')
const SocketStream = require('./socketStream')

const cameraStream = async (db, logger) => {
  await new Cameras(db, logger)
  const socketStream = new SocketStream()

  setInterval(async () => {
    for (let i = 0; i < Cameras.streams.length; i++) {
      const stream = Cameras.streams[i]
      const frame = await stream.frame()
      socketStream.emitFrame(stream.id, frame)
      socketStream.emitEvent(stream.id, stream.currentEvent, stream.events)
    }
  }, process.env.FPS || 10000 / 30)
}

module.exports = cameraStream
