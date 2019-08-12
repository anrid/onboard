import Express from 'express'
import Jwt from 'jsonwebtoken'
import Fs from 'fs'
import C from './config'
import * as T from './types'
import * as Error from './error'

let instance: T.Token

export function getInstance(): T.Token {
  if (instance != null) {
    return instance
  }

  const pubkey = Fs.readFileSync(C.TLS_PUBKEY)
  const privkey = Fs.readFileSync(C.TLS_PRIVKEY)

  function create(s: T.Session): string {
    return Jwt.sign(s, privkey, {
      algorithm: 'RS256',
      issuer: 'align',
      expiresIn: '7d',
    })
  }

  function verify(token: string): T.Session {
    return Jwt.verify(token, pubkey, { issuer: 'align' }) as T.Session
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
  isAdmin: boolean,
): T.Session {
  return {
    account_id: accountId,
    user_id: userId,
    email,
    is_admin: isAdmin,
  }
}
