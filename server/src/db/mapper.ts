import Cassandra from 'cassandra-driver'
import * as Account from './account'
import * as User from './user'
import T from '../index.d'

let mapper: T.ICQLMapper

export function createMapper(
  keyspace: string,
  client: Cassandra.Client,
): T.ICQLMapper {
  const mappingOptions = {
    models: {
      [Account.TABLE]: {
        tables: [Account.TABLE],
        keyspace,
      },
      [User.TABLE]: {
        tables: [User.TABLE],
        keyspace,
      },
    },
  }

  // Create the Mapper using the mapping options.
  const m = new Cassandra.mapping.Mapper(client, mappingOptions)
  mapper = {
    account: m.forModel(Account.TABLE),
    user: m.forModel(User.TABLE),
  }
  return mapper
}
