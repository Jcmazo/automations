'use strict'

/**
 * Mapper product to shopify
 *
 * @param {Object} params
 * @param {object} params.data
 *
 * @returns {object}
 */
export function shopifyMapper ({ data }) {
  let taxable = 'No'
  let barcode = ''
  let active = 'No'
  const name = data.title

  if (data.status === 'active') {
    active = 'Si'
  }

  const products = data.variants.map(item => {
    if (item.taxable) {
      taxable = 'Si'
    }

    if (item.barcode) {
      barcode = item.barcode
    }

    const product = {
      productId: `${item.product_id}`,
      variantsId: `${item.id}`,
      name: data.variants.length === 1 ? name : `${name} ${item.title}`.trim(),
      barcode,
      sku: item.sku ? item.sku : '',
      taxable,
      active
    }

    return product
  })

  return { products }
}
