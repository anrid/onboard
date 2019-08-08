import * as Db from './db'
import * as U from '../util'
import T from '../index.d'

export const TABLE = 'account'

export class AccountStore {
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
        id text ,
        name text,
        owner_id text,
        admins set<text>,
        logo text,
        PRIMARY KEY (id)
      );
    `,
    )
  }

  public create(d: Account): Promise<T.Result> {
    return this.c.mapper.account.insert(d)
  }

  public async getOne(id: string): Promise<Account> {
    const r = await this.c.mapper.account.get({ id })
    return Object.assign(new Account(), r)
  }
}

export class Account implements T.IAccount {
  public id: string
  public name: string = ''
  public owner_id: string = ''
  public admins: string[] = []
  public logo: string = ''

  public static create(id: string = null, name: string): Account {
    if (id == null) {
      id = U.createId()
    }
    if (name.length < 1) {
      throw Error('name is empty')
    }

    const d = new Account()
    d.id = id
    d.name = name
    return d
  }
}
