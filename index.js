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
const MongoClient = require('mongodb').MongoClient
const logger = require('./modules/logger')

/* GLOBAL VARS */
const DATABASE_URL = 'localhost' || process.env.DATABASE_URL
const DATABASE_PORT = 27017 || process.env.DATABASE_PORT

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

/* SETUP LOGGER */
app.context.logger = logger;

/* SETUP DATABASE CONNECTION */
(async () => {
  const client = await MongoClient.connect(`mongodb://${DATABASE_URL}:${DATABASE_PORT}/`, { useUnifiedTopology: true })
  app.context.logger.info('>> Server connected to database')
  app.context.db = client.db('303COM')
})()


/* SETUP PORT */
const defaultPort = 3000
const port = process.env.PORT || defaultPort

module.exports = app.listen(port, async () => app.context.logger.info(`>>  Server listening on port ${port}`))
