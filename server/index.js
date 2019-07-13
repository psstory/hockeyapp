const express = require('express')
const session = require('express-session')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
const app = next({ dir: './app', dev })

const handle = app.getRequestHandler()
const getRoutes = require('./routes/index')
//const routes = getRoutes()
const routes = getRoutes

const models = require('./db/models')

app
  .prepare()
  .then(() => {
    const server = express()
    //const showRoutes = require('./routes/index.js')

    //server.use('/api', showRoutes)
    server.use(
      session({
        secret: uuid.v1(),
        name: 'sessionId',
        resave: true,
        saveUninitialized: true
      })
    )
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(bodyParser.json())

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true)
      //console.log('parsedUrl ', parsedUrl)
      const { pathname, query = {} } = parsedUrl
      //console.log('pathname ', pathname)

      /**
       * Pull in front end routes and check agins routes
       */
      const route = routes[pathname]
      //console.log('route:', route)
      if (route) {
        return app.render(req, res, route.page, query)
      }
      return handle(req, res)
    })

    models.sequelize.sync().then(function() {
      server.listen(PORT, err => {
        if (err) throw err
        console.log(`> Ready on ${PORT}`)
      })
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
