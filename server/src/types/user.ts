import * as U from '../util'
import T from '../index.d'

export class User implements T.IUser {
  public account_id: T.ID
  public id: T.ID
  public display_name: string = ''
  public family_name: string = ''
  public given_name: string = ''
  public email: string = ''
  public photo: string = ''
  public language: string = 'en'
  public google_id: string = ''
  public is_admin: boolean = false

  public static create(
    id: T.ID = null,
    accountId: T.ID,
    displayName: string,
    email: string,
    isAdmin: boolean,
  ): User {
    if (id == null) {
      id = U.createId()
    }
    if (accountId.length < 1) {
      throw Error('accountId is empty')
    }
    if (displayName.length < 1) {
      throw Error('name is empty')
    }
    if (email.length < 1) {
      throw Error('email is empty')
    }
    if (isAdmin == null) {
      throw Error('isAdmin should be set')
    }

    const d = new User()
    d.id = id
    d.account_id = accountId
    d.display_name = displayName
    d.email = email
    d.is_admin = isAdmin
    return d
  }
}
