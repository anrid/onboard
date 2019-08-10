import * as E from '../error'
import * as Token from '../token'
import { Account } from '../types/account'
import { User } from '../types/user'
import T from '../index.d'

interface Profile {
  displayName: string
  familyName: string
  givenName: string
  photo: string
  language: string
}

interface LoginResult {
  user: T.IUser
  token: string
}

export class SignupService {
  private userStore: T.IUserStore
  private accountStore: T.IAccountStore

  public constructor(user: T.IUserStore, account: T.IAccountStore) {
    this.userStore = user
    this.accountStore = account
  }

  public async loginOrSignup(
    email: string,
    profile: Profile,
  ): Promise<LoginResult> {
    let user: T.IUser
    let session: T.ISession
    let token: string

    const users = await this.userStore.getUsersByEmail(email)
    if (users.length > 0) {
      // Found at least one existing account.
      // Create a new session and generate a new token.
      user = users[0]
      session = Token.newSession(user.account_id, user.id, user.email)
      token = Token.getInstance().create(session)
    } else {
      // Create a new account and user.
      if (profile == null) {
        throw E.InternalServerError('missing_profile', {
          message: 'Expected profile data to be passed during signup',
        })
      }

      const account = Account.create(null, '[unnamed account]')
      await this.accountStore.create(account)

      user = User.create(null, account.id, profile.displayName, email, true)
      await this.userStore.create(user)

      account.owner_id = user.id
      account.admins = [user.id]
      await this.accountStore.updateOne(account, ['id', 'owner_id', 'admins'])

      session = Token.newSession(user.account_id, user.id, user.email)
      token = Token.getInstance().create(session)
    }

    return {
      user,
      token,
    }
  }
}
