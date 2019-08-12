import * as T from './types'

export class CustomError extends Error {
  public code: string
  public status: number
  public details: T.Error

  public constructor(
    name: string,
    code: string,
    status: number,
    error: T.Error,
  ) {
    super()

    this.name = name
    this.message = `[${code}] ${error.message}`
    this.code = code
    this.status = status
    this.details = error

    Error.call(this, error.message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export function Unauthorized(code: string, error: T.Error): CustomError {
  return new CustomError('Unauthorized', code, 401, error)
}

export function BadRequest(code: string, error: T.Error): CustomError {
  return new CustomError('BadRequest', code, 400, error)
}

export function InternalServerError(code: string, error: T.Error): CustomError {
  return new CustomError('InternalServerError', code, 500, error)
}
