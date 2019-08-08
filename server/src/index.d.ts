import Cassandra from 'cassandra-driver'

export as namespace onboard
export = onboard

declare namespace onboard {
  type ID = string

  interface IAccount {
    id: ID
    owner_id: ID
    admins: ID[]
    name: string
    logo: string
  }

  interface IUser {
    account_id: ID
    id: ID
    name: string
    email: string
    photo: string
  }

  interface ICreateUserArgs {
    accountId: string
    id: string | null
    name: string
    email: string
  }

  interface ICQL {
    keyspace: string
    client: Cassandra.Client
    mapper: ICQLMapper
  }

  interface ICQLMapper {
    account: Cassandra.mapping.ModelMapper
    user: Cassandra.mapping.ModelMapper
  }

  type Result = Cassandra.mapping.Result
}

declare module 'biguint-format'
