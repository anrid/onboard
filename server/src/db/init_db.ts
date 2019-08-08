import * as Db from './db'
import C from '../config'
import { Account, AccountStore } from './account'
import { User, UserStore } from './user'
import * as M from './mapper'
import T from '../index.d'

async function initDb(): Promise<void> {
  const keyspace = C.getKeyspace()
  const client = await Db.getClient()

  console.log('Dropping keyspace:', keyspace)
  await Db.mustExec(client, `DROP KEYSPACE IF EXISTS ${keyspace}`)

  console.log('Creating keyspace:', keyspace)
  await Db.mustExec(
    client,
    `
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
  `,
  )

  const mapper = M.createMapper(keyspace, client)
  const cql: T.ICQL = {
    keyspace,
    client,
    mapper,
  }

  const accountStore = new AccountStore(cql)
  const userStore = new UserStore(cql)

  console.log('Creating table:', accountStore.name)
  await accountStore.createTable()

  console.log('Creating table:', userStore.name)
  await userStore.createTable()

  const a1 = Account.create(null, 'Test 123')
  console.log('Creating test account name=%s id=%s', a1.name, a1.id)
  await accountStore.create(a1)

  const a1g = await accountStore.getOne(a1.id)
  console.log('Fetched account:', a1g)

  const u1 = User.create(null, a1.id, 'Test Admin', 'test_admin@example.com')
  console.log(
    'Creating test user name=%s email=%s id=%s',
    u1.name,
    u1.email,
    u1.id,
  )
  await userStore.create(u1)

  const u1g = await userStore.getOne(u1.account_id, u1.id)
  console.log('Fetched account:', u1g)

  await Db.getClient().shutdown()
}

initDb().catch((err): void => console.error(err))
