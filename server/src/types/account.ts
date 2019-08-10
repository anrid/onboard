import * as U from '../util'
import T from '../index.d'

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
