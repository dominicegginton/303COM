'use strict'

/* IMPORT KOA MODULES */
const Koa = require('koa')
const favicon = require('koa-icon')
const sassy = require('koa-sassy')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')

/* IMPORT MODULES */
const http = require('http')
const MongoClient = require('mongodb').MongoClient
const logger = require('./modules/logger')

/* IMPORT ROUTERS */
const homeRouter = require('./routes/home')
const authenticationRouter = require('./routes/authentication')
const settingsRouter = require('./routes/settings')
const cameraRouter = require('./routes/camera')

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
app.use(serve('./public'))
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

/* SETUP ROUTERS */
app.use(homeRouter.routes())
app.use(homeRouter.allowedMethods())
app.use(authenticationRouter.routes())
app.use(authenticationRouter.allowedMethods())
app.use(settingsRouter.routes())
app.use(settingsRouter.allowedMethods())
app.use(cameraRouter.routes())
app.use(cameraRouter.allowedMethods())

/* SETUP PORT */
const defaultPort = 3000
const port = process.env.PORT || defaultPort

module.exports = app.listen(port, async () => app.context.logger.info(`>>  Server listening on port ${port}`))
