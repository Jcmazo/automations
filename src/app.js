'use strict'

import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import bodyParser from 'body-parser'
import initRoutes from './routes/index.js'

function initApp () {
  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())

  initRoutes(app)

  return app
}

export default initApp
