import * as E from '../error'
import * as Token from '../token'
import { Account } from '../types/account'
import { User } from '../types/user'
import * as T from '../types'

export class SignupService implements T.SignupService {
  private userStore: T.UserStore
  private accountStore: T.AccountStore

  public constructor(user: T.UserStore, account: T.AccountStore) {
    this.userStore = user
    this.accountStore = account
  }

  public async login(a: T.LoginArgs): Promise<T.LoginResult> {
    let admin: T.User
    let signup = false

    const users = await this.userStore.getUsersByEmail(a.email)
    if (users.length > 0) {
      // Found at least one existing account.
      admin = users[0]
    } else {
      // Create a new account and account admin.
      if (a.profile == null) {
        throw E.InternalServerError('missing_profile', {
          message: 'Expected profile data to be passed during signup',
        })
      }

      const res = await this.createAccount({
        accountName: '[unnamed account]',
        email: a.email,
        profile: a.profile,
      })

      admin = res.admin
      signup = true
    }

    const session = Token.newSession(
      admin.account_id,
      admin.id,
      admin.email,
      admin.is_admin,
    )
    const token = Token.getInstance().create(session)

    return {
      user: admin,
      token,
      signup,
    }
  }

  // Create a new account and account admin.
  public async createAccount(
    a: T.CreateAccountArgs,
  ): Promise<T.CreateAccountResult> {
    const account = Account.create(null, a.accountName)
    await this.accountStore.create(account)

    const admin = User.create(
      null,
      account.id,
      a.profile.display_name,
      a.email,
      true,
    )

    // Add the rest of the profile.
    Object.assign(admin, a.profile)

    await this.userStore.create(admin)

    account.owner_id = admin.id
    account.admins = [admin.id]
    await this.accountStore.updateOne(account, ['id', 'owner_id', 'admins'])

    return {
      account,
      admin,
    }
  }
}
