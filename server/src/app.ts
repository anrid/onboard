import Express from 'express'
import Https from 'https'
import Fs from 'fs'
import BodyParser from 'body-parser'
import Compression from 'compression'
import * as Token from './token'
import { GoogleController } from './controllers/google'
import { bootstrap } from './bootstrap'
import C from './config'
import * as T from './types'

export async function create(): Promise<T.App> {
  const options = {
    key: Fs.readFileSync(C.TLS_PRIVKEY),
    cert: Fs.readFileSync(C.TLS_CERT),
  }

  const app = Express()

  app.use(Compression())
  app.use(BodyParser.json())
  app.use(BodyParser.urlencoded({ extended: true }))

  // Our root.
  app.get('/', (req, res): void => {
    res.send({ message: `It's on like Donkey Kong` })
  })

  // Bootstrap and wire up controllers.
  const backend = await bootstrap()

  const googleCtrl = new GoogleController(backend.services.signup)

  app.get('/oauth', googleCtrl.auth())
  app.get('/oauth-page', googleCtrl.authPage())
  app.get('/oauth/callback', googleCtrl.authCallback())

  const requireToken = Token.getInstance().require

  // Test endpoint.
  app.get('/secret', requireToken, (req: T.MyRequest, res): void => {
    res.send({
      message: 'Secret Grotto!',
      session: req.session,
    })
  })

  const server = Https.createServer(options, app)

  return {
    app,
    server,
    start(): void {
      server.listen(C.API_PORT, (): void => {
        console.log('Listening on port %d', C.API_PORT)
      })
    },
  }
}
