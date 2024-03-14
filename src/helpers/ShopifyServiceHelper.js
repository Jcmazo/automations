'use strict'

import axios from 'axios'
import queryString from 'query-string'

const { get } = axios

const { API_VERSION } = process.env
/**
 * @class
 *
 * Shopify API functionalities
 */
class ShopifyServiceHelper {
  /**
   * Create a customer on siigo erp
   *
   * @param {SiigoCustomer} customer
   * @param {String} token
   *
   * @returns {Promise<{
   *  statusCode: Number
   *  headers: object
   *  body: Promise<object>
   * }>}
   */
  static getProducts ({ url, token, filter }) {
    const params = queryString.stringify(filter)
    return get(`${url}/admin/api/${API_VERSION}/products.json?${params}`,
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'content-type': 'application/json'
        }
      }
    )
  }

  /**
   * Shopify get product next
   *
   * @param {Object} params
   * @param {String} params.url
   *
   * @returns {Promise<{
    *  statusCode: Number
    *  headers: object
    *  body: Promise<{object}>
    * }>}
    */
  static getProductsNext ({ url, token }) {
    return get(url,
      {
        headers: {
          'X-Shopify-Access-Token': token,
          'content-type': 'application/json'
        }
      })
  }
}

export default ShopifyServiceHelper
