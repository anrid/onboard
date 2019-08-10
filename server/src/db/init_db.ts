import * as Db from './db'
import C from '../config'
import { AccountStore } from './account'
import { UserStore } from './user'
import { Account } from '../types/account'
import { User } from '../types/user'
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

  const a1 = Account.create(null, 'Test Account 1')
  a1.logo = 'x'
  console.log('Creating test account id=%s name=%s', a1.name, a1.id)
  await accountStore.create(a1)

  const a2 = Account.create(null, 'Test Account 2')
  a2.logo = 'y'
  console.log('Creating test account id=%s name=%s', a2.name, a2.id)
  await accountStore.create(a2)

  let a1g = await accountStore.getOne(a1.id)
  console.log('Fetched account: id=%s name=%s', a1g.id, a1g.name)

  const u1 = User.create(null, a1.id, 'Mr Test Admin', 'test@example.com', true)
  console.log(
    'Creating test user: id=%s account_id=%s email=%s display_name=%s',
    u1.display_name,
    u1.email,
    u1.id,
    a1.id,
  )
  await userStore.create(u1)

  const u2 = User.create(null, a2.id, 'Mr Test Admin', 'test@example.com', true)
  console.log(
    'Creating test user: id=%s account_id=%s email=%s display_name=%s',
    u2.display_name,
    u2.email,
    u2.id,
    a2.id,
  )
  await userStore.create(u2)

  const u1g = await userStore.getOne(u1.account_id, u1.id)
  console.log(
    'Fetched user: account_id=%s id=%s email=%s',
    u1g.account_id,
    u1g.id,
    u1g.email,
  )

  const users = await userStore.getUsersByEmail(u1.email)
  for (const u of users) {
    console.log(
      'Found user: email=%s account_id=%s id=%s is_admin=%s',
      u.email,
      u.account_id,
      u.id,
      u.is_admin,
    )
  }

  console.log('Updating account: id=%s name=%s', a1.id, a1.name)
  console.log('Before update:', a1)
  a1.owner_id = u1.id
  a1.admins = [u1.id]
  await accountStore.updateOne(a1, ['id', 'owner_id', 'admins'])

  console.log('Updating account: id=%s name=%s', a2.id, a2.name)
  a2.owner_id = u2.id
  a2.admins = [u2.id]
  await accountStore.updateOne(a2, ['id', 'owner_id', 'admins'])

  a1g = await accountStore.getOne(a1.id)
  console.log('Fetched account:', a1g)

  await Db.getClient().shutdown()
}

initDb().catch((err): void => console.error(err))
