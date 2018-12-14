const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

const themePath = path.join(__dirname, '../src/themes/default.less')

export default lessToJs(fs.readFileSync(themePath, 'utf8'))