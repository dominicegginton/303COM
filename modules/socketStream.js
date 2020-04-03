'use strict'

/* IMPORT MODULES */
const socketIOProvider = require('socket.io')

class SocketStream {
  constructor (server) {
    if (!SocketStream.io) SocketStream.io = socketIOProvider(server)
  }

  emitFrame (streamId, frame) {
    SocketStream.io.emit('frame-data', { streamId: streamId, frame: frame })
  }

  emitEvent (streamId, currentEvent, events) {
    SocketStream.io.emit('event-data', { streamId: streamId, currentEvent: currentEvent, events: events })
  }
}

module.exports = SocketStream
