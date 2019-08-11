import Test from 'tape'
import * as Db from './db/db'
import C from './config'
import T from './index.d'
import * as App from './app'

let app: T.IApp
let setupDbOnce = false

export async function setupApp(): Promise<T.IApp> {
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

  if (dropKeyspace) {
    console.log('Dropping keyspace:', keyspace)
    await Db.mustExec(client, `DROP KEYSPACE IF EXISTS ${keyspace}`)
  }

  console.log('Creating keyspace:', keyspace)
  await Db.mustExec(
    client,
    `
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
  `,
  )

  Test.onFinish((): void => {
    client.shutdown()
  })

  setupDbOnce = true
}
