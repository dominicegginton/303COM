'use strict'

/* IMPORT MODULES */
require('@tensorflow/tfjs-node')
const faceapi = require('face-api.js')
const cv = require('opencv4nodejs')
const ObjectID = require('mongodb').ObjectID
const canvas = require('canvas')
const fs = require('fs-extra')

class FacialRecognition {
  constructor (db) {
    return (async () => {
      if (!db || typeof db.collection !== 'function') throw new Error('db should be mongodb db object')
      this.collection = db.collection('faces')

      const { Canvas, Image, ImageData } = canvas
      faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

      await faceapi.nets.ssdMobilenetv1.loadFromDisk('./assets/weights')
      await faceapi.nets.faceLandmark68Net.loadFromDisk('./assets/weights')
      await faceapi.nets.faceRecognitionNet.loadFromDisk('./assets/weights')

      if (!FacialRecognition.descriptors) {
        const people = await this.collection.find({}).toArray()
        FacialRecognition.descriptors = people.map(person => {
          // decode json from db and add to this.descriptors
          const descriptor = JSON.parse(person.descriptor)
          descriptor.descriptor = new Float32Array(Object.values(descriptor.descriptor))
          return new faceapi.LabeledFaceDescriptors(person.name, [new Float32Array(descriptor.descriptor)])
        })
        if (FacialRecognition.descriptors.length > 0) FacialRecognition.faceMatcher = new faceapi.FaceMatcher(FacialRecognition.descriptors)
      }
      return this
    })()
  }

  async add (name, image) {
    if (!name) throw new Error('name can not be empty')
    if (!image) throw new Error('image can not be empty')
    if (typeof name !== 'string') throw new Error('name must be type string')
    if (!fs.existsSync(image.path)) throw new Error('image not found')
    // process image to tensor
    const imageMat = cv.imread(image.path)
    const imageData = new Uint8Array(imageMat.cvtColor(cv.COLOR_BGR2RGB).getData().buffer)
    const imageTensor = faceapi.tf.tensor3d(imageData, [imageMat.rows, imageMat.cols, 3])
    // get descriptor
    const descriptor = await faceapi.detectSingleFace(imageTensor).withFaceLandmarks().withFaceDescriptor()
    const jsonDescriptor = JSON.stringify(descriptor)
    const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(name, [new Float32Array(descriptor.descriptor)])
    // add to faceMatcher
    FacialRecognition.descriptors.push(labeledFaceDescriptor)
    FacialRecognition.faceMatcher = new faceapi.FaceMatcher(FacialRecognition.descriptors)

    const data = await this.collection.insertOne({ name: name, descriptor: jsonDescriptor })
    return data.insertedId
  }

  async remove (id) {
    if (id instanceof ObjectID) {
      let face = await this.collection.find({ _id: id }).toArray()
      face = face[0]
      FacialRecognition.descriptors = FacialRecognition.descriptors.filter(descriptor => { 
        return descriptor._label !== face.name 
      })
      if (FacialRecognition.descriptors.length === 0) FacialRecognition.faceMatcher = null
      else FacialRecognition.faceMatcher = new faceapi.FaceMatcher(FacialRecognition.descriptors)
      await this.collection.deleteOne({ _id: id })
    } else throw new Error('id must be type MongoDB object')
  }

  async getFaces () {
    const people = await this.collection.find({}).toArray()
    return people
  }

  async process (frame) {
    const frameData = new Uint8Array(frame.cvtColor(cv.COLOR_BGR2RGB).getData().buffer)
    const frameTensor = faceapi.tf.tensor3d(frameData, [frame.rows, frame.cols, 3])
    const descriptors = await faceapi.detectAllFaces(frameTensor).withFaceLandmarks().withFaceDescriptors()
    if (descriptors.length === 0) return [null, frame]
    const matchedFaces = descriptors.map(descriptor => {
      let matchedFace = { _label: 'unknown' }
      if (FacialRecognition.faceMatcher) matchedFace = FacialRecognition.faceMatcher.findBestMatch(descriptor.descriptor)
      const dectectionBox = descriptor.detection._box
      let color = new cv.Vec3(36, 255, 12)
      if (matchedFace._label === 'unknown') color = new cv.Vec3(0, 0, 255)
      frame.drawRectangle(new cv.Point2(dectectionBox._x, dectectionBox._y), new cv.Point2(dectectionBox._x + dectectionBox._width, dectectionBox._y + dectectionBox._height), color, 1)
      frame.putText(matchedFace._label, new cv.Point2(dectectionBox._x, dectectionBox._y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.9, color, 1)
      return matchedFace
    })

    return [matchedFaces, frame]
  }
}

module.exports = FacialRecognition
