import * as Db from './db'
import { bootstrap } from '../bootstrap'
import C from '../config'

export async function run(): Promise<void> {
  const b = await bootstrap()

  const client = Db.getClient()
  const keyspace = C.getKeyspace()

  await Db.createKeyspace(client, keyspace, true)

  await b.stores.account.createTable()
  await b.stores.user.createTable()

  const profile = {
    display_name: 'Mr Test Admin',
    family_name: 'Admin',
    given_name: 'Test',
    language: 'en',
    photo: 'x',
  }

  const a1 = await b.services.signup.createAccount({
    accountName: 'Test Account 1',
    email: 'test_admin@example.com',
    profile,
  })
  console.log(
    'Created test account id=%s name=%s',
    a1.account.name,
    a1.account.id,
  )

  const a2 = await b.services.signup.createAccount({
    accountName: 'Test Account 2',
    email: 'test_admin@example.com',
    profile,
  })
  console.log(
    'Created test account id=%s name=%s',
    a2.account.name,
    a2.account.id,
  )

  let a1g = await b.stores.account.getOne(a1.account.id)
  console.log('Fetched account: id=%s name=%s', a1g.id, a1g.name)

  const u1g = await b.stores.user.getOne(a1g.id, a1g.admins[0])
  console.log(
    'Fetched account admin: account_id=%s id=%s email=%s',
    u1g.account_id,
    u1g.id,
    u1g.email,
  )

  const users = await b.stores.user.getUsersByEmail(u1g.email)
  for (const u of users) {
    console.log(
      'Found user with email %s: account_id=%s id=%s is_admin=%s',
      u.email,
      u.account_id,
      u.id,
      u.is_admin,
    )
  }

  await Db.getClient().shutdown()
}
