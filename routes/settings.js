'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')

/* SETUP ROUTER */
const router = new Router()

router.get('/settings', async ctx => {
  if (ctx.session.authenticated !== true) ctx.redirect('/login')
  else await ctx.render('settings')
})

module.exports = router
