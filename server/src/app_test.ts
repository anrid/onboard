import Test from 'tape'
import Request from 'supertest'
import * as Token from './token'
import * as App from './app'

const app = App.create().app

Test('GET /', (t): void => {
  t.plan(1)

  Request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res): void => {
      // console.log(res.body)
      t.ok(
        String(res.body.message).includes('It’s on'),
        'should contain "It’s on"',
      )
    })
})

Test('GET /secret', (t): void => {
  t.plan(2)

  const session = Token.newSession('x', 'y', 'z')
  const token = Token.getInstance().create(session)

  Request(app)
    .get('/secret')
    .set('Authorization', 'Bearer ' + token)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res): void => {
      // console.log(res.body)
      t.ok(
        res.body.message.includes('Secret Grotto!'),
        'should contain "Secret Grotto!"',
      )
      t.equal(
        res.body.session.account_id,
        session.account_id,
        'should return session with account_id',
      )
    })
    .catch((err): void => {
      t.fail('got error: ' + err.message)
    })
})
