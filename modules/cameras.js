'use strict'

/* IMPORT MODULES */
const ObjectID = require('mongodb').ObjectID
const Stream = require('./stream')

/* GLOBAL VARIABLES */
const DEV_WEBCAM_NAME = 'Development Webcam'
const DEV_WEBCAM_ADDRESS = 0

class Cameras {
  constructor (db) {
    return (async () => {
      if (!db || typeof db.collection !== 'function') throw new Error('db should be mongodb db object')
      this.collection = db.collection('cameras')
      if (!Cameras.streams) {
        const cameras = await this.collection.find({}).toArray()
        Cameras.streams = cameras.map(camera => new Stream(camera._id, camera.name, camera.address))
        if (process.env.DEV_WEBCAM) Cameras.streams.push(new Stream(ObjectID(), DEV_WEBCAM_NAME, DEV_WEBCAM_ADDRESS))
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
      Cameras.streams.push(new Stream(id, name, address))
    } catch (error) { throw new Error('Can not connect to camera') }
    const data = await this.collection.insertOne({ _id: id, name: name, address: address })
    return data.insertedId
  }

  async get () {
    const data = await this.collection.find()
    const cameraDocuments = await data.toArray()
    return cameraDocuments
  }

  async remove (id) {
    if (!id) throw new Error('id can not be empty')
    if (typeof id !== 'string') throw new Error('id must be type string')
    const data = await this.collection.deleteOne({ _id: ObjectId(id) })
    if (data.result.n !== 1 || data.result.n !== 1) return false
    return true
  }
}

module.exports = Cameras
