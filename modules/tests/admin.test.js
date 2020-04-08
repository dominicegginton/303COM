'use strict'

/* IMPORT TEST */
const Admin = require('../admin')

/* IMPORT MODULES */
const MongoClient = require('mongodb').MongoClient
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const bcrypt = require('bcrypt')

beforeEach(async () => {
  jest.resetModules()
  this.mongoMemoryServer = new MongoMemoryServer()
  const uri = await this.mongoMemoryServer.getUri()

  this.client = await MongoClient.connect(uri, { useUnifiedTopology: true })
  this.db = this.client.db('TEST')
})

afterEach(async () => {
  this.client.close()
  this.mongoMemoryServer.stop()
})

describe('Admin', () => {
  describe('constructor()', () => {
    describe('db', () => {
      test('should throw error when null', async () => {
        expect(new Admin()).rejects.toThrow(new Error('db should be mongodb db object'))
      })

      test('should throw error when db is not type of mongodb db object', async () => {
        expect(new Admin({})).rejects.toThrow(new Error('db should be mongodb db object'))
      })

      test('should not throw error when db is type of mongodb db object', async () => {
        expect(new Admin(this.db)).resolves.not.toThrow()
      })

      test('should return type object', async () => {
        const admin = await new Admin(this.db)
        expect(typeof admin).toBe('object')
      })

      test('should create admin document in admin collection', async () => {
        await new Admin(this.db)
        expect(await this.db.collection('admin').countDocuments()).toBe(1)
      })

      test('should not create duplicate admin document in admin collection', async () => {
        await new Admin(this.db)
        expect(await this.db.collection('admin').countDocuments()).toBe(1)
        await new Admin(this.db)
        expect(await this.db.collection('admin').countDocuments()).toBe(1)
      })

      test('should create admin document with default password', async () => {
        await new Admin(this.db)
        expect(await this.db.collection('admin').countDocuments()).toBe(1)
        const data = await this.db.collection('admin').find({}).toArray()
        const adminAccount = data[0]
        expect(await bcrypt.compare('password', adminAccount.password)).toBe(true)
      })
    })
  })

  describe('login()', () => {
    describe('arguments', () => {
      describe('password', () => {
        test('should throw error when password is null', async () => {
          const admin = await new Admin(this.db)
          expect(admin.login()).rejects.toThrow(new Error('password can not be empty'))
        })

        test('should throw error when password is not type string', async () => {
          const admin = await new Admin(this.db)
          expect(admin.login(2)).rejects.toThrow(new Error('password must be type string'))
        })

        test('should accept password of type string', async () => {
          const admin = await new Admin(this.db)
          expect(admin.login('password')).resolves.not.toThrow()
        })
      })
    })

    test('should return admin id when password matches', async () => {
      const admin = await new Admin(this.db)
      const adminId = await admin.login('password')
      expect(typeof adminId).toBe('string')
      expect(adminId.length).toBe(24)
    })

    test('should throw error when password is invalid', async () => {
      const admin = await new Admin(this.db)
      expect(admin.login('invalid')).rejects.toThrow(new Error('Invalid Password'))
    })
  })

  describe('updatePassword()', () => {
    describe('arguments', () => {
      describe('currentPassword', () => {
        test('should throw error when null', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword(null, 'newPassword', 'newPassword')).rejects.toThrow(new Error('currentPassword can not be empty'))
        })

        test('should throw error when type is not string', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword(9, 'newPassword', 'newPassword')).rejects.toThrow(new Error('currentPassword must be type string'))
        })

        test('should accept string', async () => {
          const admin = await new Admin(this.db)
          expect(await admin.updatePassword('password', 'newPassword', 'newPassword')).toBe(true)
        })
      })

      describe('newPassword', () => {
        test('should throw error when null', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword('password', null, 'newPassword')).rejects.toThrow(new Error('newPassword can not be empty'))
        })

        test('should throw error when type is not string', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword('password', 9, 'newPassword')).rejects.toThrow(new Error('newPassword must be type string'))
        })

        test('should accept string', async () => {
          const admin = await new Admin(this.db)
          expect(await admin.updatePassword('password', 'newPassword', 'newPassword')).toBe(true)
        })
      })

      describe('confirmPassword', () => {
        test('should throw error when null', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword('password', 'newPassword', null)).rejects.toThrow(new Error('confirmPassword can not be empty'))
        })

        test('should throw error when type is not string', async () => {
          const admin = await new Admin(this.db)
          expect(admin.updatePassword('password', 'newPassword', 9)).rejects.toThrow(new Error('confirmPassword must be type string'))
        })

        test('should accept string', async () => {
          const admin = await new Admin(this.db)
          expect(await admin.updatePassword('password', 'newPassword', 'newPassword')).toBe(true)
        })
      })
    })

    test('should throw error if currentPassword is invalid', async () => {
      const admin = await new Admin(this.db)
      expect(admin.updatePassword('invalid', 'newPassword', 'newPassword')).rejects.toThrow(new Error('Invalid Password'))
    })

    test('should throw error when new password and confirm password dont match', async () => {
      const admin = await new Admin(this.db)
      expect(admin.updatePassword('password', 'newPassword', 'invalid')).rejects.toThrow(new Error('new password must match confirm password'))
    })

    test('should update admin password if currentPassword is valid', async () => {
      const admin = await new Admin(this.db)
      await admin.updatePassword('password', 'newPassword', 'newPassword')
      const data = await this.db.collection('admin').find({}).toArray()
      const adminAccount = data[0]
      expect(await bcrypt.compare('newPassword', adminAccount.password)).toBe(true)
    })
  })
})
