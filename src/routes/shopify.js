'use strict'

import { getProductsShopify } from '../controllers/Shopify.js'

const api = '/api/v1/shopify'

async function shopifyRoutes (app) {
  app.post(`${api}`, async (req, res) => {
    await getProductsShopify(req, res)
  })
}

export default shopifyRoutes
