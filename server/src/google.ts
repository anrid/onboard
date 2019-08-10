import * as Express from 'express'
import Assert from 'assert'
import * as Google from 'google-auth-library'
import C from './config'
import * as E from './error'
import { fail } from './util'

// Make sure Google OAuth credentials exist and contain
// the expected redirect uri.
const keys = require(C.GOOGLE_OAUTH_CREDENTIALS) // eslint-disable-line @typescript-eslint/no-var-requires
Assert(
  keys.web.redirect_uris.find(
    (x: string): boolean => x === C.GOOGLE_OAUTH_REDIRECT_URI,
  ),
  'Expected credentials to contains redirect uri: ' +
    C.GOOGLE_OAUTH_REDIRECT_URI,
)

function getClient(): Google.OAuth2Client {
  return new Google.OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    C.GOOGLE_OAUTH_REDIRECT_URI,
  )
}

export function authHandler(req: Express.Request, res: Express.Response): void {
  res.send({
    url: getAuthUrl(),
  })
}

export async function authCallbackHandler(
  req: Express.Request,
  res: Express.Response,
): Promise<void> {
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

  const c = getClient()

  try {
    // Use code to acquire tokens.
    const tokens = await c.getToken(code)
    console.log('Got tokens:', tokens)

    // Make sure to set the credentials on the OAuth2 client.
    c.setCredentials(tokens.tokens)

    const userinfo = await c.request({
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
    })
    console.log('Got userinfo:', userinfo)

    res.send({
      userinfo,
    })
  } catch (err) {
    return fail(
      res,
      E.InternalServerError('google_oauth_error', {
        message: `Could not get userinfo: ${err.message}`,
      }),
    )
  }
}

export function getAuthUrl(): string {
  const c = getClient()

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = c.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
  })

  return authorizeUrl
}
