import Assert from 'assert'
import Dotenv from 'dotenv'

Dotenv.config()

Assert(process.env.ONBOARD_API_HOST, 'missing env ONBOARD_API_HOST')
Assert(process.env.ONBOARD_API_PORT, 'missing env ONBOARD_API_PORT')

Assert(process.env.ONBOARD_TLS_PUBKEY, 'missing env ONBOARD_TLS_PUBKEY')
Assert(process.env.ONBOARD_TLS_PRIVKEY, 'missing env ONBOARD_TLS_PRIVKEY')
Assert(process.env.ONBOARD_TLS_CERT, 'missing env ONBOARD_TLS_CERT')

Assert(process.env.ONBOARD_CQL_SCHEMA, 'missing env ONBOARD_CQL_SCHEMA')
Assert(process.env.ONBOARD_CQL_HOST, 'missing env ONBOARD_CQL_HOST')

export default {
  API_HOST: process.env.ONBOARD_API_HOST,
  API_PORT: process.env.ONBOARD_API_PORT,

  TLS_PUBKEY: process.env.ONBOARD_TLS_PUBKEY,
  TLS_PRIVKEY: process.env.ONBOARD_TLS_PRIVKEY,
  TLS_CERT: process.env.ONBOARD_TLS_CERT,

  CQL_SCHEMA: process.env.ONBOARD_CQL_SCHEMA,
  CQL_HOST: process.env.ONBOARD_CQL_HOST,

  TESTING: process.env.TESTING,

  getKeyspace(): string {
    return this.TESTING
      ? this.ONBOARD_CQL_SCHEMA + '_test'
      : this.ONBOARD_CQL_SCHEMA
  },
}
