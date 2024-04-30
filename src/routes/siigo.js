'use strict'

import { getProductsSiigo } from '../controllers/Siigo.js'

const api = '/api/v1/siigo'

async function siigoRoutes (app) {
  app.post(`${api}`, async (req, res) => {
    await getProductsSiigo(req, res)
  })
}

export default siigoRoutes
