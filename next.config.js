const withLess = require('@zeit/next-less')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// antd custom variables
// const paletteLess = fs.readFileSync(
//   './app/assets/less/antd-custom.less',
//   'utf8'
// )

const paletteLess = fs.readFileSync(
  path.resolve(__dirname, './app/assets/less/antd-custom.less'),
  'utf8'
)
console.log('paletteLess', paletteLess)

const themeVariables = lessToJs(paletteLess, {
  resolveVariables: true,
  stripPrefix: true
})

/*
themeVariables = lessToJs(
  fs.readFileSync(
    path.resolve(__dirname, './app/assets/less/antd-custom.less')
  ),
  'utf8'
)
*/

// fix error when less files are required by node

if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}

module.export = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables
  }
})
