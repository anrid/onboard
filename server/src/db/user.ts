import * as Db from './db'
import { User } from '../types/user'
import T from '../index.d'

export const TABLE = 'user'

export class UserStore implements T.IUserStore {
  public name: string = TABLE
  public c: T.ICQL

  public constructor(c: T.ICQL) {
    this.c = c
  }

  public async createTable(): Promise<void> {
    await Db.mustExec(
      this.c.client,
      `
      CREATE TABLE IF NOT EXISTS ${this.c.keyspace}.${this.name} (
        account_id text,
        id text,
        display_name text,
        family_name text,
        given_name text,
        email text,
        photo text,
        language text,
        google_id text,
        is_admin boolean,
        PRIMARY KEY (account_id, id)
      );
    `,
    )

    await Db.mustExec(
      this.c.client,
      `
      CREATE MATERIALIZED VIEW ${this.c.keyspace}.${this.name}_by_email AS
        SELECT * FROM ${this.c.keyspace}.${this.name}
        WHERE email IS NOT NULL AND account_id IS NOT NULL AND id IS NOT NULL
        PRIMARY KEY(email, account_id, id);
    `,
    )
  }

  public create(d: T.IUser): Promise<T.Result> {
    return this.c.mapper.user.insert(d)
  }

  public async getOne(accountId: string, id: string): Promise<T.IUser> {
    const r = await this.c.mapper.user.get({ account_id: accountId, id })
    return Object.assign(new User(), r)
  }

  public async getUsersByEmail(email: string): Promise<T.IUser[]> {
    const q = `SELECT * FROM ${this.c.keyspace}.${this.name}_by_email WHERE email = ?`
    const rs = await this.c.client.execute(q, [email])
    // console.log('r=', r)
    return rs.rows.map((x): T.IUser => Object.assign(new User(), x))
  }
}
