'use strict'

/* IMPORT KOA MODULES */
const Koa = require('koa')
const favicon = require('koa-icon')
const sassy = require('koa-sassy')
const views = require('koa-views')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')

/* IMPORT MODULES */
const http = require('http')

/* SETUP KOA */
const app = new Koa()
app.server = http.createServer(app.callback())
app.keys = ['secure'] // TODO: Update this to improve security
app.use(favicon('./assets/logo.png', { type: 'png' }))
app.use(sassy('./sass'))
app.use(views('./views', { extension: 'pug' }))
app.use(session({
  signed: true,
  rolling: true,
  renew: true
}, app))
app.use(bodyParser())

/* SETUP PORT */
const defaultPort = 3000
const port = process.env.PORT || defaultPort

module.exports = app.listen(port, async () => app.context.logger.info(`>>  Server listening on port ${port}`))
