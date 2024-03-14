'use strict'

import { getProductsShopify } from '../controllers/Shopify.js'

const api = '/api/v1/shopify'

async function shopifyRoutes (app) {
  app.get(`${api}`, getProductsShopify)
}

export default shopifyRoutes
