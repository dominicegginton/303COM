'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const FacialRecognition = require('../modules/facialRecognition')
const ObjectID = require('mongodb').ObjectID

/* SETUP ROUTER */
const router = new Router()

router.get('/face/new', async ctx => {
  if (ctx.session.authenticated === true) {
    await ctx.render('face_new', { authenticated: true })
  } else ctx.redirect('/login')
})

router.post('/face/new', async ctx => {
  if (ctx.session.authenticated === true) {
    try {
      const data = ctx.request.body
      const files = ctx.request.files
      const facialRecognition = await new FacialRecognition(ctx.db)
      await facialRecognition.add(data.name, files.faceImage)
      ctx.redirect('/')
    } catch (error) {
      console.log(error)
      await ctx.render('face_new', { authenticated: true, error: error })
    }
  } else ctx.redirect('/login')
})

router.post('/face/remove', async ctx => {
  if (ctx.session.authenticated === true) {
    try {
      const data = ctx.request.body
      const facialRecognition = await new FacialRecognition(ctx.db)
      await facialRecognition.remove(ObjectID(data.id))
      ctx.redirect('/settings')
    } catch (error) {
      await ctx.render('error', { authenticated: true, error: error })
    }
  } else ctx.redirect('/login')
})

module.exports = router
