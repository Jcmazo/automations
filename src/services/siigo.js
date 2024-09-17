'use strict'

import logger from '../utils/logger.js'
import SiigoServiceHelper from '../helpers/SiigoServiceHelper.js'
import { siigoMapper } from '../mappers/siigoProduct.js'
import CSV from '../utils/csv.js'

class SiigoProduct {
  static async getProductsSiigo (body) {
    const { username, accessKey } = body

    const productsData = []
    const { data: { access_token: token } } = await SiigoServiceHelper.auth({
      username,
      accessKey
    })

    const { status: statusCode, data } = await SiigoServiceHelper.getProducts({
      token,
      filter: { active: true }
    })

    if (statusCode >= 400) {
      logger.fatal('Error searching for products in siigo')
    }

    if (data.results.length) {
      const productsProcess = await this.#processProducts(data.results)
      productsData.push(...productsProcess)
    }

    if (data._links) {
      const product = await this.fetchProducts({ link: data._links, token })
      productsData.push(...product)
    }

    logger.info(`all products were processed total ${productsData.length}`)

    await CSV.created(productsData)

    return productsData
  }

  static async #processProducts (data) {
    const productsData = []
    for (const productToMap of data) {
      try {
        const { product } = await this.#mapperProducts(productToMap)
        productsData.push(product)
      } catch (err) {
        logger.fatal('Error in mapperProducts')
        continue
      }
    }
    return productsData
  }

  static async #mapperProducts (productToMap) {
    try {
      const product = await this.#buildProducts(productToMap)
      return product
    } catch (err) {
      logger.fatal('Error in buildProducts')
    }
  }

  static async fetchProducts ({ link, token }) {
    const productsData = []
    let url = link.next.href
    while (url) {
      const { status: statusCode, data } = await SiigoServiceHelper.getProductsNext({
        url,
        token
      })

      if (statusCode >= 400) {
        logger.fatal('Error searching for the following url of products in  siigo')
      }

      const productsProcess = await this.#processProducts(data.results)
      productsData.push(...productsProcess)

      url = await this.#getUrlNext({ link: data._links })
    }
    return productsData
  }

  static async #buildProducts (data) {
    return siigoMapper({ data })
  }

  static async #getUrlNext ({ link }) {
    if (link && link.next && link.next.href) {
      return link.next.href
    }
    return null
  }
}

export default SiigoProduct
