import Express from 'express'
import Jwt from 'jsonwebtoken'
import Fs from 'fs'
import C from './config'
import T from './index.d'
import * as Error from './error'

let instance: T.IToken

export function getInstance(): T.IToken {
  if (instance != null) {
    return instance
  }

  const pubkey = Fs.readFileSync(C.TLS_PUBKEY)
  const privkey = Fs.readFileSync(C.TLS_PRIVKEY)

  function create(s: T.ISession): string {
    return Jwt.sign(s, privkey, { algorithm: 'RS256', issuer: 'align' })
  }

  function verify(token: string): T.ISession {
    return Jwt.verify(token, pubkey, { issuer: 'align' }) as T.ISession
  }

  // Require token middleware.
  function require(
    req: T.MyRequest,
    res: Express.Response,
    next: Express.NextFunction,
  ): void {
    if (!req.headers || !req.headers.authorization) {
      return next(
        Error.Unauthorized('missing_authorization_header', {
          message: 'Format is Authorization: Bearer [token]',
        }),
      )
    }

    const parts = req.headers.authorization.split(' ')
    if (parts.length != 2) {
      return next(
        Error.Unauthorized('bad_authorization_header', {
          message: 'Format is Authorization: Bearer [token]',
        }),
      )
    }

    const scheme = parts[0]
    const token = parts[1]

    if (scheme.toLowerCase() !== 'bearer') {
      return next(
        Error.Unauthorized('bad_scheme', {
          message: 'Format is Authorization: Bearer [token]',
        }),
      )
    }

    if (token.length < 10) {
      return next(
        Error.Unauthorized('bad_token', {
          message: 'Format is Authorization: Bearer [token]',
        }),
      )
    }

    try {
      const session = verify(token)
      req.session = session
    } catch (err) {
      return next(
        Error.Unauthorized('invalid_token', {
          message: 'Token could not be decoded: ' + err.message,
        }),
      )
    }
    next()
  }

  instance = {
    create,
    verify,
    require,
  }

  return instance
}

export function newSession(
  accountId: string,
  userId: string,
  email: string,
): T.ISession {
  return {
    account_id: accountId,
    user_id: userId,
    email,
  }
}
