'use strict'

/* IMPORT KOA MODULES */
const Koa = require('koa')
const favicon = require('koa-icon')
const sassy = require('koa-sassy')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const body = require('koa-body')

/* IMPORT MODULES */
const http = require('http')
const MongoClient = require('mongodb').MongoClient
const logger = require('./modules/logger')
const SocketStream = require('./modules/socketStream')
const CameraStream = require('./modules/cameraStream')

/* IMPORT ROUTERS */
const homeRouter = require('./routes/home')
const authenticationRouter = require('./routes/authentication')
const settingsRouter = require('./routes/settings')
const cameraRouter = require('./routes/camera')
const faceRouter = require('./routes/face')

/* GLOBAL VARS */
const DATABASE_URL = 'localhost' || process.env.DATABASE_URL
const DATABASE_PORT = 27017 || process.env.DATABASE_PORT
const PORT = 3000 || process.env.PORT

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
app.use(body({ multipart: true }))
app.use(bodyParser())

/* SETUP ROUTERS */
app.use(homeRouter.routes())
app.use(homeRouter.allowedMethods())
app.use(authenticationRouter.routes())
app.use(authenticationRouter.allowedMethods())
app.use(settingsRouter.routes())
app.use(settingsRouter.allowedMethods())
app.use(cameraRouter.routes())
app.use(cameraRouter.allowedMethods())
app.use(faceRouter.routes())
app.use(faceRouter.allowedMethods())

/* SETUP APP */
;(async () => {
  // attach logger to app
  app.context.logger = logger
  // connect to MongoDB database
  const client = await MongoClient.connect(`mongodb://${DATABASE_URL}:${DATABASE_PORT}/`, { useUnifiedTopology: true })
  app.context.logger.info('Database connected', { db_url: DATABASE_URL, db_port: DATABASE_PORT })
  // attach database to app
  app.context.db = client.db('303COM')
  // setup socket stream
  // eslint-disable-next-line no-new
  new SocketStream(app.server)
  // start streaming cameras
  CameraStream(app.context.db, app.context.logger)
  app.context.logger.info('Camera streams started')
  // start http server
  app.server.listen(PORT, async () => app.context.logger.info('Server listening', { port: PORT }))
})()
