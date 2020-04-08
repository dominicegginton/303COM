'use strict'

/* IMPORT MODULES */
const Router = require('@koa/router')
const Admin = require('../modules/admin')

/* SETUP ROUTER */
const router = new Router()

router.get('/login', async ctx => {
  if (ctx.session.authenticated !== true) await ctx.render('login')
  else ctx.redirect('/')
})

router.post('/login', async ctx => {
  const admin = await new Admin(ctx.db)
  try {
    const data = ctx.request.body
    const adminId = await admin.login(data.password)
    ctx.session.authenticated = true
    ctx.session.id = adminId
    ctx.redirect('/')
  } catch (error) {
    await ctx.render('login', { error: error })
  }
})

router.get('/logout', async ctx => {
  ctx.session.authenticated = false
  ctx.session.id = undefined
  ctx.redirect('/login')
})

module.exports = router
