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
  let active = data.status
  const name = data.title

  if (!data.status) {
    active = ''
  }

  const products = data.variants.map(item => {
    const price = Number.parseFloat(item.price)
    if (item.taxable) {
      taxable = 'Si'
    }

    if (item.barcode) {
      barcode = item.barcode
    }

    const product = {
      productId: `${item.product_id}`,
      variantsId: `${item.id}`,
      inventoryId: item.inventory_item_id,
      name: data.variants.length === 1 ? name : `${name} ${item.title}`.trim(),
      barcode,
      sku: item.sku ? item.sku : '',
      price,
      taxable,
      active
    }

    return product
  })

  return { products }
}

/**
 * Mapper varinats to shopify
 *
 *
 * @returns {object}
 */
export function shopifyVariantMapper ({ data }) {
  const products = data.variants.map(item => {
    const product = {
      title: item.title
    }

    return product
  })

  return { products }
}
