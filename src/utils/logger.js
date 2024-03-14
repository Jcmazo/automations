'use strict'

import pino from 'pino'
import pretty from 'pino-pretty'

const logger = pino(pretty({
  colorize: true
}))

/**
 * @module
 *
 * pino logger instance
 */
export default logger
