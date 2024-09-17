'use strict'

import logger from '../utils/logger.js'
import ShopifyServiceHelper from '../helpers/ShopifyServiceHelper.js'
import AlegraHelperService from '../helpers/AlegraHelperService.js'
import { shopifyMapper, shopifyVariantMapper } from '../mappers/shopifyProduct.js'
import CSV from '../utils/csv.js'

class ShopifyProduct {
  static async getProductsShopify (data) {
    const { url, token } = data
    const productsData = []
    const { status: statusCode, data: { products }, headers } = await ShopifyServiceHelper.getProducts({
      url,
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

  static async getVariants (data) {
    let missing
    const { url, token } = data
    const variantsData = []
    const { status: statusCode, data: { products }, headers } = await ShopifyServiceHelper.getProducts({
      url,
      token,
      filter: { limit: 250 }
    })

    if (statusCode >= 400) {
      logger.fatal('Error searching for products in shopify')
    }

    if (products.length) {
      const variantsProcess = await this.#processVariants(products)
      variantsData.push(...variantsProcess)
    }

    if (headers.link) {
      const variants = await this.fetchVariants({ link: headers.link, token })
      variantsData.push(...variants)
    }

    let uniqueVariants = new Set()

    variantsData.forEach(variant => {
      uniqueVariants.add(variant.title.toUpperCase())
    })

    uniqueVariants = Array.from(uniqueVariants).map(title => ({ title }))

    if (data.isComparedVariant) {
      missing = await this.#ComparedVariant(data, uniqueVariants)
    }

    logger.info(`all variants were processed total ${uniqueVariants.length}`)

    await CSV.created(uniqueVariants)

    return { variants: uniqueVariants, missing }
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

  static async #processVariants (data) {
    const varianstData = []
    for (const product of data) {
      try {
        const variants = await this.#mappVariants({ product })
        varianstData.push(...variants)
      } catch (err) {
        logger.fatal('Error in processVariants')
        continue
      }
    }
    return varianstData
  }

  static async #createSingleVariants ({ product }) {
    try {
      const { products } = await this.#buildProducts(product)
      return products
    } catch (err) {
      logger.fatal('Error in buildProducts')
    }
  }

  static async #mappVariants ({ product }) {
    try {
      const { products } = await this.#buildVariants(product)
      return products
    } catch (err) {
      logger.fatal('Error in buildProducts')
    }
  }

  static async fetchVariants ({ link, token }) {
    const variantsData = []
    let url = link.substring(1, link.lastIndexOf('>;'))
    while (url) {
      const { status: statusCode, data: { products }, headers } = await ShopifyServiceHelper.getProductsNext({
        url,
        token
      })

      if (statusCode >= 400) {
        logger.fatal('Error searching for the following url of products in  shopify')
      }

      const variantsProcess = await this.#processVariants(products)
      variantsData.push(...variantsProcess)

      url = await this.#getUrlNext(headers.link)
    }
    return variantsData
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

  static async #buildVariants (data) {
    return shopifyVariantMapper({ data })
  }

  static async #ComparedVariant (data, uniqueVariants) {
    const token = {
      username: data.erpCredentials.username,
      password: data.erpCredentials.password
    }

    const { data: alegraVariants } = await AlegraHelperService.getProductVariants({ status: 'active', token })
    const alegraVariantsMap = new Set()

    alegraVariants.forEach(variant => {
      variant.options.forEach(option => {
        alegraVariantsMap.add(option.value.toUpperCase())
      })
    })

    const missingVariants = uniqueVariants.filter(variant => {
      return !alegraVariantsMap.has(variant.title.toUpperCase())
    })

    return missingVariants
  }
}

export default ShopifyProduct
