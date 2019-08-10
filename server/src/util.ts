import * as Express from 'express'
import Int from 'biguint-format'
import FlakeId from 'flake-idgen'
import { CustomError } from './error'

export function createId(): string {
  const gen = new FlakeId()
  return Int(gen.next(), 'hex', { prefix: 'X' })
}

export function fail(res: Express.Response, err: CustomError): void {
  console.error('Error:', err.stack)
  res.status(err.status).send({
    code: err.code,
    message: err.message,
    details: err.details,
  })
}
