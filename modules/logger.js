'use strict'

/* IMPORT WINSTON */
const Winston = require('winston')

const logger = Winston.createLogger({
  level: 'silly',
  format: Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.json()
  ),
  transports: [
    new Winston.transports.File({ filename: './logs/events.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new Winston.transports.Console({
    format: Winston.format.simple()
  }))
}

module.exports = logger
