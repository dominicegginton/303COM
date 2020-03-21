'use strict'

/* IMPORT MODULES */
const ObjectId = require('mongodb').ObjectID

class Cameras {
  constructor (db) {
    return (async () => {
      if (!db || typeof db.collection !== 'function') throw new Error('db should be mongodb db object')
      this.collection = db.collection('cameras')
      return this
    })()
  }

  async add (name, address) {
    const data = await this.collection.insertOne({ name: name, address: address })
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
