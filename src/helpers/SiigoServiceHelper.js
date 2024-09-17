'use strict'

import axios from 'axios'
import queryString from 'query-string'

const { get, post } = axios

const { SIIGO_API_URL } = process.env
/**
 * @class
 *
 * Shopify API functionalities
 */
class SiigoServiceHelper {
  /**
   * Siigo authentication
   *
   * @param {String} username
   * @param {String} accessKey
   *
   * @returns {Promise<{
   *  statusCode: Number
   *  headers: object
   *  body: Promise<{
   *    access_token: String
   *  }>
   * }>}
   */
  static auth ({ username, accessKey }) {
    return post(`${SIIGO_API_URL}/auth`,
      JSON.stringify({ username, access_key: accessKey }),
      {
        headers: {
          'content-type': 'application/json',
          'Partner-Id': 'savia'
        }
      })
  }

  /**
   * get a products on siigo
   *
   * @param {SiigoProducts} products
   * @param {String} token
   *
   * @returns {Promise<{
   *  statusCode: Number
   *  headers: object
   *  body: Promise<object>
   * }>}
   */
  static getProducts ({ filter, token }) {
    const params = queryString.stringify(filter)
    return get(`${SIIGO_API_URL}/v1/products?${params}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'Partner-Id': 'savia'
        }
      }
    )
  }

  /**
   * siigo get product next
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
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'Partner-Id': 'savia'
        }
      }
    )
  }
}

export default SiigoServiceHelper
