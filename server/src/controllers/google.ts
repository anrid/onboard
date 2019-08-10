import * as Express from 'express'
import Assert from 'assert'
import * as Google from 'google-auth-library'
import C from '../config'
import * as E from '../error'
import { fail } from '../util'
import T from '../index.d'

interface GooglePlusProfile {
  emails: [{ value: string; type: string }]
  displayName: string
  name: { familyName: string; givenName: string }
  image: {
    url: string
  }
  language: string
}

interface Credentials {
  web: {
    redirect_uris: string[]
    client_id: string
    client_secret: string
  }
}

export class GoogleController {
  private keys: Credentials

  public constructor() {
    // Make sure Google OAuth credentials exist and contain
    // the expected redirect uri.
    this.keys = require(C.GOOGLE_OAUTH_CREDENTIALS) // eslint-disable-line @typescript-eslint/no-var-requires
    Assert(
      this.keys.web.redirect_uris.find(
        (x: string): boolean => x === C.GOOGLE_OAUTH_REDIRECT_URI,
      ),
      'Expected credentials to contain redirect uri: ' +
        C.GOOGLE_OAUTH_REDIRECT_URI,
    )
  }

  public getClient(): Google.OAuth2Client {
    return new Google.OAuth2Client(
      this.keys.web.client_id,
      this.keys.web.client_secret,
      C.GOOGLE_OAUTH_REDIRECT_URI,
    )
  }

  public auth(): T.Handler {
    return (req: T.MyRequest, res: Express.Response): void => {
      res.send({
        url: this.getAuthUrl(),
      })
    }
  }

  public authCallback(): T.Handler {
    return async (req: T.MyRequest, res: Express.Response): Promise<void> => {
      try {
        const code = req.query.code
        if (!code) {
          return fail(
            res,
            E.BadRequest('missing_code', {
              message: 'Missing query string param ?code=x',
            }),
          )
        }
        console.log(`Got code: ${code}`)

        const c = this.getClient()

        // Use code to acquire tokens.
        const tokens = await c.getToken(code)
        console.log('Got tokens:', tokens)

        // Make sure to set the credentials on the OAuth2 client.
        c.setCredentials(tokens.tokens)

        const r = await c.request({
          url: 'https://www.googleapis.com/plus/v1/people/me',
        })

        const profile = r.data as GooglePlusProfile
        console.log('Got profile:', profile)

        // const email = profile.emails[0].value

        res.send({
          profile,
        })
      } catch (err) {
        return fail(
          res,
          E.InternalServerError('google_oauth_error', {
            message: `Could not get profile: ${err.message}`,
          }),
        )
      }
    }
  }

  public getAuthUrl(): string {
    const c = this.getClient()

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = c.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    })

    return authorizeUrl
  }
}
