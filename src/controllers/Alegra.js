'use strict'

import AlegraProduct from '../services/alegra.js'
import logger from '../utils/logger.js'

const getProductsAlegra = async (req, res) => {
  try {
    const products = await AlegraProduct.getProductsAlegra(req.body)
    const count = products.length
    return res.json({ products, count })
  } catch (err) {
    logger.fatal(err)
    return res.status(500).json(err)
  }
}

export { getProductsAlegra }
