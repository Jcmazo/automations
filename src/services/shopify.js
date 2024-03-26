'use strict'

import logger from '../utils/logger.js'
import ShopifyServiceHelper from '../helpers/ShopifyServiceHelper.js'
import { shopifyMapper } from '../mappers/shopifyProduct.js'
import CSV from '../utils/csv.js'

const { URL_SHOPIFY, TOKEN_SHOPIFY } = process.env

class ShopifyProduct {
  static async getProductsShopify () {
    const productsData = []
    const token = TOKEN_SHOPIFY
    const { status: statusCode, data: { products }, headers } = await ShopifyServiceHelper.getProducts({
      url: URL_SHOPIFY,
      token,
      filter: { limit: 250 }
    })

    if (statusCode >= 400) {
      logger.fatal('Error searching for products in shopify')
    }

    if (products.length) {
      const productsProcess = await this.#processProductsSync(products)
      productsData.push(...productsProcess)
    }

    if (headers.link) {
      const product = await this.fetchProducts({ link: headers.link, token })
      productsData.push(...product)
    }

    logger.info(`all products were processed total ${productsData.length}`)

    await CSV.created(productsData)

    return productsData
  }

  static async #processProductsSync (data) {
    const productsData = []
    for (const product of data) {
      try {
        const products = await this.#createSingleVariants({ product })
        productsData.push(...products)
      } catch (err) {
        logger.fatal('Error in createSingleVariants')
        continue
      }
    }
    return productsData
  }

  static async #createSingleVariants ({ product }) {
    try {
      const { products } = await this.#buildProducts(product)
      return products
    } catch (err) {
      logger.fatal('Error in buildProducts')
    }
  }

  static async fetchProducts ({ link, token }) {
    const productsData = []
    let url = link.substring(1, link.lastIndexOf('>;'))
    while (url) {
      const { status: statusCode, data: { products }, headers } = await ShopifyServiceHelper.getProductsNext({
        url,
        token
      })

      if (statusCode >= 400) {
        logger.fatal('Error searching for the following url of products in  shopify')
      }

      const productsProcess = await this.#processProductsSync(products)
      productsData.push(...productsProcess)

      url = await this.#getUrlNext(headers.link)
    }
    return productsData
  }

  static async #getUrlNext (link) {
    const match = link.match(/<([^>]+)>; rel="next"/)
    return match ? match[1] : null
  }

  static async #buildProducts (data) {
    return shopifyMapper({ data })
  }
}

export default ShopifyProduct
