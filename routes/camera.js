'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Cameras = require('../modules/cameras')
const ObjectID = require('mongodb').ObjectID

/* SETUP ROUTER */
const router = new Router()

router.get('/camera/details/:id', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    const camera = Cameras.streams.find(stream => stream.id.equals(ObjectID(ctx.params.id)))
    if (!camera) {
      ctx.render('error', { authenticated: true, error: { message: 'camera id not found' } })
    }
    await ctx.render('camera', { authenticated: true, camera: camera })
  } else ctx.redirect('/login')
})

router.get('/camera/new', async ctx => {
  if (ctx.session.authenticated === true) {
    await ctx.render('camera_new', { authenticated: true })
  } else ctx.redirect('/login')
})

router.post('/camera/new', async ctx => {
  if (ctx.session.authenticated === true) {
    try {
      const data = ctx.request.body
      const cameras = await new Cameras(ctx.db)
      await cameras.add(data.name, data.address)
      ctx.redirect('/')
    } catch (error) {
      await ctx.render('camera_new', { authenticated: true, error: error })
    }
  } else ctx.redirect('/login')
})

router.post('/camera/remove', async ctx => {
  if (ctx.session.authenticated === true) {
    try {
      const data = ctx.request.body
      const cameras = await new Cameras(ctx.db)
      const camera = Cameras.streams.find(stream => stream.id.equals(ObjectID(data.id)))
      if (!camera) {
        ctx.render('error', { authenticated: true, error: 'camera id not found' })
      }
      await cameras.remove(ObjectID(data.id))
      ctx.redirect('/settings')
    } catch (error) {
      await ctx.render('error', { authenticated: true, error: error })
    }
  } else ctx.redirect('/login')
})

module.exports = router
