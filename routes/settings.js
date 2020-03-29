'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Cameras = require('../modules/cameras')

/* SETUP ROUTER */
const router = new Router()

router.get('/settings', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    await ctx.render('settings', { streams: Cameras.streams })
  } else ctx.redirect('/login')
})

module.exports = router
