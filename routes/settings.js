'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Cameras = require('../modules/cameras')
const Admin = require('../modules/admin')
const FacialRecognition = require('../modules/facialRecognition')

/* SETUP ROUTER */
const router = new Router()

router.get('/settings', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    const facialRecognition = await new FacialRecognition(ctx.db)
    const faces = await facialRecognition.getFaces()
    await ctx.render('settings', { authenticated: true, streams: Cameras.streams, faces: faces })
  } else ctx.redirect('/login')
})

router.post('/settings/password', async ctx => {
  if (ctx.session.authenticated === true) {
    await new Cameras(ctx.db)
    const admin = await new Admin(ctx.db)
    try {
      const data = ctx.request.body
      await admin.updatePassword(data.currentPassword, data.newPassword, data.confirmPassword)
      ctx.redirect('/')
    } catch (error) {
      await ctx.render('settings', { authenticated: true, streams: Cameras.streams, error: error })
    }
  } else ctx.redirect('/login')
})

module.exports = router
