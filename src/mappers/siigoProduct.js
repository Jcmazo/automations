'use strict'

/**
 * Mapper product to siigo
 *
 * @param {Object} params
 * @param {object} params.data
 *
 * @returns {object}
 */
export function siigoMapper ({ data }) {
  let active = 'No'

  if (data.active){
    active = 'Si'
  }

  let tax = 0

  if (data && data.taxes && data.taxes.length > 0) {
    tax = data.taxes[0].percentage
  }

  const product = {
    productId: `${data.id}`,
    name: data.name,
    sku: data.code ? data.code : '',
    tax,
    active,
  }

  return { product }
}
