import * as Db from './db'
import C from './config'
import accountStore from './account_store'
import userStore from './user_store'

async function initDb(): Promise<void> {
  const keyspace = C.getKeyspace()

  console.log('Dropping keyspace:', keyspace)
  await Db.mustExec(`DROP KEYSPACE IF EXISTS ${keyspace}`)

  console.log('Creating keyspace:', keyspace)
  await Db.mustExec(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
  `)

  console.log('Using keyspace:', keyspace)
  await Db.mustExec(`USE ${keyspace}`)

  console.log('Creating table:', accountStore.name)
  await accountStore.createTable()

  console.log('Creating table:', userStore.name)
  await userStore.createTable()

  await Db.getClient().shutdown()
}

initDb().catch((err): void => console.error(err))
