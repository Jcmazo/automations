'use strict'

function buildToken (token, base) {
  return Buffer.from(token, 'utf-8').toString(base)
}

export default buildToken
