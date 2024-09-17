'use strict'

import logger from '../utils/logger.js'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class CSV {
  static async created (data) {
    const keys = new Set(Object.keys(data[0]).flat())

    const convertToCSVRow = (obj) => {
      const values = [...keys].map((key) => {
        let value = obj[key] !== undefined ? obj[key] : ''
        value = value.toString().replace(/"/g, '""')
        return `"${value}"`
      })
      return values.join(',')
    }

    const rows = []
    rows.push([...keys].map((key) => `"${key}"`).join(','))
    data.forEach((obj) => {
      rows.push(convertToCSVRow(obj))
    })
    const csvContent = rows.join('\n')

    const filePath = path.join(__dirname, 'data.csv')
    fs.writeFileSync(filePath, csvContent)

    logger.info(`The data.csv file has been successfully created in: ${filePath}`)
  }
}

export default CSV
