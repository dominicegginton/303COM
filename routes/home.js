'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Cameras = require('../modules/cameras')

/* SETUP ROUTER */
const router = new Router()

router.get('/', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    await ctx.render('home', { authenticated: true, streams: Cameras.streams })
  } else ctx.redirect('/login')
})

module.exports = router
