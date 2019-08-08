import Express from 'express'
import Https from 'https'
import Fs from 'fs'
import BodyParser from 'body-parser'
import Compression from 'compression'
import * as Token from './token'
import C from './config'
import T from './index.d'

export function create(): T.IApp {
  const options = {
    key: Fs.readFileSync(C.TLS_PRIVKEY),
    cert: Fs.readFileSync(C.TLS_CERT),
  }

  const app = Express()

  app.use(Compression())
  app.use(BodyParser.json())
  app.use(BodyParser.urlencoded({ extended: true }))

  app.get('/', (req, res): void => {
    res.send({ message: 'It’s on like Donkey Kong' })
  })

  const requireToken = Token.getInstance().require

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
