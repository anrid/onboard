import * as Db from './db'

class AccountStore {
  public name: string = 'account'

  public createTable(): Promise<void> {
    return Db.mustExec(`
      CREATE TABLE IF NOT EXISTS ${this.name} (
        id text ,
        owner_id text,
        admins set<text>,
        name text,
        logo text,
        PRIMARY KEY (id)
      );
    `)
  }
}

const store = new AccountStore()

export default store
