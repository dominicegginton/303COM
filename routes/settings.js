'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Cameras = require('../modules/cameras')
const Admin = require('../modules/admin')

/* SETUP ROUTER */
const router = new Router()

router.get('/settings', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    await ctx.render('settings', { streams: Cameras.streams })
  } else ctx.redirect('/login')
})

router.post('/settings/password', async ctx => {
  await new Cameras(ctx.db)
  const admin = await new Admin(ctx.db)
  try {
    const data = ctx.request.body
    await admin.updatePassword(data.currentPassword, data.newPassword, data.confirmPassword)
    ctx.redirect('/')
  } catch (error) {
    await ctx.render('settings', { streams: Cameras.streams, error: error })
  }
})

module.exports = router
