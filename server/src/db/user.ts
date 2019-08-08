import * as Db from './db'
import * as U from '../util'
import T from '../index.d'

export const TABLE = 'user'

export class UserStore {
  public name: string = TABLE
  public c: T.ICQL

  public constructor(c: T.ICQL) {
    this.c = c
  }

  public createTable(): Promise<void> {
    return Db.mustExec(
      this.c.client,
      `
      CREATE TABLE IF NOT EXISTS ${this.c.keyspace}.${this.name} (
        account_id text ,
        id text,
        name text,
        email text,
        photo text,
        PRIMARY KEY (account_id, id)
      );
    `,
    )
  }

  public create(d: User): Promise<T.Result> {
    return this.c.mapper.user.insert(d)
  }

  public async getOne(accountId: string, id: string): Promise<User> {
    const r = await this.c.mapper.user.get({ account_id: accountId, id })
    return Object.assign(new User(), r)
  }
}

export class User implements T.IUser {
  public account_id: T.ID
  public id: T.ID
  public name: string = ''
  public email: string = ''
  public photo: string = ''

  public static create(
    id: T.ID = null,
    accountId: T.ID,
    name: string,
    email: string,
  ): User {
    if (id == null) {
      id = U.createId()
    }
    if (accountId.length < 1) {
      throw Error('accountId is empty')
    }
    if (name.length < 1) {
      throw Error('name is empty')
    }
    if (email.length < 1) {
      throw Error('email is empty')
    }

    const d = new User()
    d.id = id
    d.account_id = accountId
    d.name = name
    d.email = email
    return d
  }
}
