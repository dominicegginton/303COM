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

  async exists () {
    if (await this.collection.countDocuments() > 0) return true
    else return false
  }
}

module.exports = Admin
