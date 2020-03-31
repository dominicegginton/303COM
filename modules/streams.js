'use strict'

/* IMPORT MODULES */
const Cameras = require('../modules/cameras')
const socketIOProvider = require('socket.io')

const streams = async (server, db, logger) => {
  const io = socketIOProvider(server)
  await new Cameras(db)

  setInterval(async () => {
    for (let i = 0; i < Cameras.streams.length; i++) {
      const stream = Cameras.streams[i]
      const frame = await stream.frame()
      io.emit(`frame-data-${stream.id}`, { frame: frame })
    }
  }, process.env.FPS || 10000 / 30)
}

module.exports = streams
