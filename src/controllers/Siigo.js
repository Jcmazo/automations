'use strict'

import SiigoProduct from '../services/siigo.js'
import logger from '../utils/logger.js'

const getProductsSiigo = async (req, res) => {
  try {
    const products = await SiigoProduct.getProductsSiigo(req.body)
    const count = products.length
    return res.json({ products, count })
  } catch (err) {
    logger.fatal(err)
    return res.status(500).json(err)
  }
}

export { getProductsSiigo }
