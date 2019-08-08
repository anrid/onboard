import Int from 'biguint-format'
import FlakeId from 'flake-idgen'

export function createId(): string {
  const gen = new FlakeId()
  return Int(gen.next(), 'hex', { prefix: 'X' })
}
