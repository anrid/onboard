import Test from 'tape'
import Request from 'supertest'
import * as Token from './token'
import * as Helper from './test_helper'

Test(
  'GET /',
  async (t): Promise<void> => {
    t.plan(1)

    const app = await Helper.setupApp()

    try {
      const res = await Request(app.app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)

      // console.log(res.body)
      t.ok(
        String(res.body.message).includes(`It's on`),
        `should contain "It's on"`,
      )
    } catch (err) {
      t.fail(err.message)
    }
  },
)

Test(
  'GET /secret',
  async (t): Promise<void> => {
    t.plan(2)

    const app = await Helper.setupApp()
    const session = Token.newSession('x', 'y', 'z', true)
    const token = Token.getInstance().create(session)

    try {
      const res = await Request(app.app)
        .get('/secret')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)

      // console.log(res.body)
      t.ok(
        res.body.message.includes('Secret Grotto!'),
        'should contain "Secret Grotto!"',
      )
      t.equal(
        res.body.session.account_id,
        session.account_id,
        'should return session with correct account id',
      )
    } catch (err) {
      t.fail(err.message)
    }
  },
)
