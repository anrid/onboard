import * as Db from './db'

class UserStore {
  public name: string = 'user'

  public createTable(): Promise<void> {
    return Db.mustExec(`
      CREATE TABLE IF NOT EXISTS ${this.name} (
        account text ,
        id text,
        name text,
        email text,
        PRIMARY KEY (account, id)
      );
    `)
  }
}

const store = new UserStore()

export default store
