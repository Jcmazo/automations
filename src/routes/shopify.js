'use strict'

import { getProductsShopify, getVariants } from '../controllers/Shopify.js'

const api = '/api/v1/shopify'

async function shopifyRoutes (app) {
  app.post(`${api}`, async (req, res) => {
    await getProductsShopify(req, res)
  })

  app.post(`${api}/variants`, async (req, res) => {
    await getVariants(req, res)
  })
}

export default shopifyRoutes
