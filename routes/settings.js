'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')

/* SETUP ROUTER */
const router = new Router()

router.get('/settings', async ctx => {
  if (ctx.session.authenticated === true) {
    await ctx.render('settings')
  } else ctx.redirect('/login')
})

module.exports = router
