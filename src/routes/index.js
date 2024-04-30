'use strict'

import initShopifyRoutes from './shopify.js'
import initSiigoRoutes from './siigo.js'

function initRoutes (app) {
  initShopifyRoutes(app)
  initSiigoRoutes(app)
}

export default initRoutes
