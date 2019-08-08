import T from './index.d'

export class CustomError extends Error {
  public code: string
  public status: number
  public details: T.IError

  public constructor(
    name: string,
    code: string,
    status: number,
    error: T.IError,
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

export function UnauthorizedError(code: string, error: T.IError): CustomError {
  return new CustomError('UnauthorizedError', code, 401, error)
}
