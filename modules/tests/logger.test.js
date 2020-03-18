'use strict'

beforeEach(async () => {
  jest.resetModules()
})

describe('logger()', () => {
  test('should be type object', async () => {
    const logger = require('../logger')
    expect(typeof logger).toBe('object')
  })

  describe('transports', () => {
    test('should write to 3 transports when node environment is not production', async () => {
      const logger = require('../logger')
      expect(logger.transports.length).toBe(3)
    })

    test('should write to 2 file transports when node environment is production', async () => {
      process.env.NODE_ENV = 'production'
      const logger = require('../logger')
      expect(logger.transports.length).toBe(2)
    })
  })
})
