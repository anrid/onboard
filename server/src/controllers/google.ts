import * as Express from 'express'
import Assert from 'assert'
import * as Google from 'google-auth-library'
import C from '../config'
import * as E from '../error'
import { fail } from '../util'
import * as T from '../types'

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
  private signupSvc: T.SignupService

  public constructor(signupSvc: T.SignupService) {
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

    this.signupSvc = signupSvc
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

  public authPage(): T.Handler {
    return (req: T.MyRequest, res: Express.Response): void => {
      res.send(`<a href="${this.getAuthUrl()}">Signin by Google</a>`)
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

        const client = this.getClient()

        // Use code to acquire tokens.
        const r1 = await client.getToken(code)
        console.log('Got tokens:', r1.tokens)

        // Make sure to set the credentials on the OAuth2 client.
        client.setCredentials(r1.tokens)

        const r2 = await client.request({
          url: 'https://www.googleapis.com/plus/v1/people/me',
        })

        const profile = r2.data as GooglePlusProfile
        console.log('Got profile:', profile)
        const email = profile.emails[0].value

        const r3 = await this.signupSvc.login({
          email,
          profile: {
            display_name: profile.displayName,
            given_name: profile.name.givenName,
            family_name: profile.name.familyName,
            language: profile.language,
            photo: profile.image.url,
          },
        })

        res.send(r3)
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
