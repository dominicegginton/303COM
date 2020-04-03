'use strict'

/* IMPORT MODULES */
const ObjectID = require('mongodb').ObjectID
const Stream = require('./stream')

/* GLOBAL VARIABLES */
const DEV_WEBCAM_NAME = 'Development Webcam'
const DEV_WEBCAM_ADDRESS = 0

class Cameras {
  constructor (db, logger) {
    return (async () => {
      if (!db || typeof db.collection !== 'function') throw new Error('db should be mongodb db object')
      this.collection = db.collection('cameras')
      this.logger = logger
      if (!Cameras.streams) {
        const cameras = await this.collection.find({}).toArray()
        Cameras.streams = cameras.map(camera => new Stream(camera._id, camera.name, camera.address, this.logger))
        if (process.env.DEV_WEBCAM) Cameras.streams.push(new Stream(ObjectID(), DEV_WEBCAM_NAME, DEV_WEBCAM_ADDRESS, this.logger))
      }
      return this
    })()
  }

  async add (name, address) {
    if (!name) throw new Error('name should not be empty')
    if (!address) throw new Error('address should not be empty')
    if (typeof name !== 'string') throw new Error('name should be type string')
    if (await this.exists(address)) throw new Error('camera already exists')
    const id = ObjectID()
    try {
      Cameras.streams.push(new Stream(id, name, address, this.logger))
    } catch (error) { throw new Error('Can not connect to camera') }
    const data = await this.collection.insertOne({ _id: id, name: name, address: address })
    return data.insertedId
  }

  async remove (id) {
    if (id instanceof ObjectID) {
      Cameras.streams = Cameras.streams.filter(stream => { return !stream.id.equals(id) })
      await this.collection.deleteOne({ _id: id })
    } else throw new Error('id must be type MongoDB ObjectId')
  }

  async exists (address) {
    if (!address) throw new Error('address must not be empty')
    if (typeof address !== 'string') throw new Error('address must be type string')
    if (await this.collection.countDocuments({ address: address }) > 0) return true
    else return false
  }
}

module.exports = Cameras
