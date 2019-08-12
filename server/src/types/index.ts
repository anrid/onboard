import Cassandra from 'cassandra-driver'
import Express from 'express'
import Https from 'https'
import { SignupService } from 'src/services/signup'

export type ID = string

export interface Account {
  id: ID
  owner_id: ID
  admins: ID[]
  name: string
  logo: string
}

export interface User {
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

export interface CreateUserArgs {
  accountId: string
  id: string | null
  name: string
  email: string
}

export interface CQL {
  keyspace: string
  client: Cassandra.Client
  mapper: CQLMapper
}

export interface CQLMapper {
  account: Cassandra.mapping.ModelMapper
  user: Cassandra.mapping.ModelMapper
}

export interface App {
  app: Express.Application
  server: Https.Server
  start: () => void
}

export interface Session {
  account_id: string
  user_id: string
  email: string
  is_admin: boolean
}

export interface Token {
  create(s: Session): string
  verify(t: string): Session
  require(
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ): void
}

export interface Error {
  message: string
}

export type Result = Cassandra.mapping.Result

export type MyRequest = Express.Request & {
  session: Session
}

export type Handler = (req: MyRequest, res: Express.Response) => void

export interface AccountStore extends Store {
  create(d: Account): Promise<Result>
  getOne(id: string): Promise<Account>
  updateOne(a: Account, fields: string[]): Promise<void>
}

export interface UserStore extends Store {
  create(d: User): Promise<Result>
  getOne(accountId: string, id: string): Promise<User>
  getUsersByEmail(email: string): Promise<User[]>
}

export interface Store {
  createTable(): Promise<void>
  deleteAll(): Promise<void>
}

export interface UserProfile {
  display_name: string
  family_name: string
  given_name: string
  photo: string
  language: string
}

export interface LoginArgs {
  email: string
  profile?: UserProfile
}

export interface LoginResult {
  user: User
  token: string
  signup: boolean
}

export interface CreateAccountArgs {
  accountName: string
  email: string
  profile: UserProfile
}

export interface CreateAccountResult {
  account: Account
  admin: User
}

export interface SignupService {
  login(a: LoginArgs): Promise<LoginResult>
  createAccount(a: CreateAccountArgs): Promise<CreateAccountResult>
}

export interface Backend {
  stores: {
    user: UserStore
    account: AccountStore
  }
  services: {
    signup: SignupService
  }
}
