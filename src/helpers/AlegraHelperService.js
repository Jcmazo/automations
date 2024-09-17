'use strict'

import axios from 'axios'
import buildToken from '../utils/buildToken.js'

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
}

export default AlegraHelperService
