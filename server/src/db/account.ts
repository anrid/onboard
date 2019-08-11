import * as Db from './db'
import { Account } from '../types/account'
import T from '../index.d'

export const TABLE = 'account'

export class AccountStore implements T.IAccountStore {
  public name: string = TABLE
  public c: T.ICQL

  public constructor(c: T.ICQL) {
    this.c = c
  }

  public createTable(): Promise<void> {
    console.log(`Creating table: ${this.c.keyspace}.${this.name}`)

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

  public create(d: T.IAccount): Promise<T.Result> {
    return this.c.mapper.account.insert(d)
  }

  public async getOne(id: string): Promise<T.IAccount> {
    const r = await this.c.mapper.account.get({ id })
    return Object.assign(new Account(), r)
  }

  public async updateOne(a: T.IAccount, fields: string[]): Promise<void> {
    await this.c.mapper.account.update(a, { fields })
    return
  }

  public async deleteAll(): Promise<void> {
    const q = `TRUNCATE TABLE ${this.c.keyspace}.${this.name}`
    await this.c.client.execute(q)
    return
  }
}
