'use strict'

/* IMPORT MODULES */
const bcrypt = require('bcrypt')

/* MODULE VARIABLES */
const SALT_ROUNDS = 10
const DEFAULT_PASSWORD = 'password' || process.env.DEFAULT_PASSWORD

class Admin {
  constructor (db) {
    return (async () => {
      if (!db || typeof db.collection !== 'function') throw new Error('db should be mongodb db object')
      this.collection = db.collection('admin')

      // add new admin
      if (!await this.exists()) {
        const admin = {
          name: 'admin',
          password: await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS)
        }
        await this.collection.insertOne(admin)
      }

      return this
    })()
  }

  async login (password) {
    if (!password) throw new Error('password can not be empty')
    if (typeof password !== 'string') throw new Error('password must be type string')
    const data = await this.collection.find({ name: 'admin' }).toArray()
    const admin = data[0]
    if (!await bcrypt.compare(password, admin.password)) throw new Error('Invalid Password')
    else return admin._id.toHexString()
  }

  async exists () {
    if (await this.collection.countDocuments() > 0) return true
    else return false
  }
}

module.exports = Admin
