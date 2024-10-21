'use strict'

import axios from 'axios'
import buildToken from '../utils/buildToken.js'
import queryString from 'query-string'

const { get } = axios

/**
 * @class
 *
 * alegra API functionalities
 */
class AlegraHelperService {
  /**
   * Get variants on alegra erp
   *
   * @param {AlegraVariants} Variants
   * @param {String} token: username:password
   *
   * @returns {Promise<{
 *  statusCode: Number
    *  headers: object
    *  body: Promise<object>
    * }>}
    */
  static getProductVariants ({ status, token }) {
    return get(
        `${process.env.ALEGRA_API_URL}/v1/variant-attributes?status=${status}`,
        {
          headers: {
            Authorization: `Basic ${buildToken(
              `${token.username}:${token.password}`,
              'base64'
            )}`,
            'content-type': 'application/json'
          }
        })
  }

  /**
   * Get variants on alegra erp
   *
   * @param {AlegraVariants} Variants
   * @param {String} token: username:password
   *
   * @returns {Promise<{
 *  statusCode: Number
    *  headers: object
    *  body: Promise<object>
    * }>}
    */
  static getProducts ({ filters, token }) {
    const params = queryString.stringify(filters, { skipNull: true, skipEmptyString: true })
    return get(
        `${process.env.ALEGRA_API_URL}/v1/items?${params}`,
        {
          headers: {
            Authorization: `Basic ${buildToken(
              `${token.username}:${token.password}`,
              'base64'
            )}`,
            'content-type': 'application/json'
          }
        })
  }
}

export default AlegraHelperService
