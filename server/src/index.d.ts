import Cassandra from 'cassandra-driver'
import Express from 'express'
import Https from 'https'

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
    display_name: string
    family_name: string
    given_name: string
    email: string
    photo: string
    language: string
    google_id: string
    is_admin: boolean
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
    is_admin: boolean
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

  type Handler = (req: MyRequest, res: Express.Response) => void

  interface IAccountStore extends IStore {
    create(d: IAccount): Promise<Result>
    getOne(id: string): Promise<IAccount>
    updateOne(a: IAccount, fields: string[]): Promise<void>
  }

  interface IUserStore extends IStore {
    create(d: IUser): Promise<Result>
    getOne(accountId: string, id: string): Promise<IUser>
    getUsersByEmail(email: string): Promise<IUser[]>
  }

  interface IStore {
    createTable(): Promise<void>
    deleteAll(): Promise<void>
  }

  interface IUserProfile {
    displayName: string
    familyName: string
    givenName: string
    photo: string
    language: string
  }

  interface ILoginOrSignupResult {
    user: IUser
    token: string
    signup: boolean
  }

  interface ISignupService {
    loginOrSignup(
      email: string,
      profile: IUserProfile,
    ): Promise<ILoginOrSignupResult>
  }

  interface IBackend {
    stores: {
      user: IUserStore
      account: IAccountStore
    }
    services: {
      signup: ISignupService
    }
  }
}
