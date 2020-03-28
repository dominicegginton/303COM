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
      ctx.redirect('/')
      return
    }
    await ctx.render('camera', { camera: camera })
  } else ctx.redirect('/login')
})

module.exports = router
