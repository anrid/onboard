import { SignupService } from './services/signup'
import * as Db from './db/db'
import * as Mapper from './db/mapper'
import { AccountStore } from './db/account'
import { UserStore } from './db/user'
import C from './config'
import * as T from './types'

export async function bootstrap(): Promise<T.Backend> {
  const keyspace = C.getKeyspace()
  const client = await Db.getClient()

  const mapper = Mapper.createMapper(keyspace, client)
  const cql: T.CQL = {
    keyspace,
    client,
    mapper,
  }

  const accountStore = new AccountStore(cql)
  const userStore = new UserStore(cql)

  const signupSvc = new SignupService(userStore, accountStore)

  return {
    stores: {
      account: accountStore,
      user: userStore,
    },
    services: {
      signup: signupSvc,
    },
  }
}
