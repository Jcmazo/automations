'use strict'

import initApp from './src/app.js'
import logger from './src/utils/logger.js'

const app = initApp()
const PORT = process.env.PORT || 3029

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
