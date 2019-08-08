import Cassandra from 'cassandra-driver'
import Express from 'express'
import Https from 'https'
import { verify } from 'jsonwebtoken'
import { isError } from 'util'

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

  interface IApp {
    app: Express.Application
    server: Https.Server
    start: () => void
  }

  interface ISession {
    account_id: string
    user_id: string
    email: string
  }

  interface IToken {
    create(s: ISession): string
    verify(t: string): ISession
    require(
      req: Express.Request,
      res: Express.Response,
      next: Express.NextFunction,
    ): void
  }

  interface IError {
    message: string
  }

  type Result = Cassandra.mapping.Result

  type MyRequest = Express.Request & {
    session: ISession
  }
}
