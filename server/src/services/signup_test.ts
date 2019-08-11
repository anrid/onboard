import Test from 'tape'
import { bootstrap } from '../bootstrap'
import * as Helper from '../test_helper'

Test(
  'Test SignupService',
  async (t): Promise<void> => {
    await Helper.setupDb(false)

    const b = await bootstrap()

    await b.stores.account.createTable()
    await b.stores.account.deleteAll()

    await b.stores.user.createTable()
    await b.stores.user.deleteAll()

    t.test(
      'signup',
      async (t): Promise<void> => {
        t.plan(6)

        const email = 'ace@base.se'
        const profile = {
          displayName: 'Ace Base',
          familyName: 'Base',
          givenName: 'Ace',
          language: 'en',
          photo: 'x',
        }

        let res = await b.services.signup.loginOrSignup(email, profile)

        t.ok(
          res.token.length > 10,
          `should have a token that's longer than 10 chars`,
        )
        t.equal(res.user.email, email, `should have correct email address`)
        t.ok(res.signup, `should be a signup`)

        res = await b.services.signup.loginOrSignup(email, profile)

        t.ok(
          res.token.length > 10,
          `should have a token that's longer than 10 chars`,
        )
        t.equal(res.user.email, email, `should have correct email address`)
        t.notok(res.signup, `should not be a signup`)
      },
    )
  },
)
