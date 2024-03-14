'use strict'

import ShopifyProduct from '../services/shopify.js'
import logger from '../utils/logger.js'

const getProductsShopify = async (req, res) => {
  try {
    const products = await ShopifyProduct.getProductsShopify()
    const count = products.length
    return res.json({ products, count })
  } catch (err) {
    logger.fatal(err)
    return res.status(424).json(err)
  }
}

export { getProductsShopify }
