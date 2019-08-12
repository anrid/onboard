import Test from 'tape'
import * as Db from './db/db'
import C from './config'
import * as T from './types'
import * as App from './app'

let app: T.App
let setupDbOnce = false

export async function setupApp(): Promise<T.App> {
  if (app) {
    return app
  }
  app = await App.create()
  return app
}

export async function setupDb(dropKeyspace: boolean): Promise<void> {
  if (setupDbOnce) {
    return
  }

  // Force testing mode.
  C.TESTING = true

  const keyspace = C.getKeyspace()
  const client = await Db.getClient()

  await Db.createKeyspace(client, keyspace, dropKeyspace)

  Test.onFinish((): void => {
    client.shutdown()
  })

  setupDbOnce = true
}
