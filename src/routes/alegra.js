'use strict'

import { getProductsAlegra } from '../controllers/Alegra.js'

const api = '/api/v1/alegra'

async function alegraRoutes (app) {
  app.post(`${api}`, async (req, res) => {
    await getProductsAlegra(req, res)
  })
}

export default alegraRoutes
