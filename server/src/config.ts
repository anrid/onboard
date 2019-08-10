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

Assert(
  process.env.ONBOARD_GOOGLE_OAUTH_CREDENTIALS,
  'missing env ONBOARD_GOOGLE_OAUTH_CREDENTIALS',
)
Assert(
  process.env.ONBOARD_GOOGLE_OAUTH_REDIRECT_URI,
  'missing env ONBOARD_GOOGLE_OAUTH_REDIRECT_URI',
)

const config = {
  API_HOST: process.env.ONBOARD_API_HOST,
  API_PORT: process.env.ONBOARD_API_PORT,

  TLS_PUBKEY: process.env.ONBOARD_TLS_PUBKEY,
  TLS_PRIVKEY: process.env.ONBOARD_TLS_PRIVKEY,
  TLS_CERT: process.env.ONBOARD_TLS_CERT,

  CQL_SCHEMA: process.env.ONBOARD_CQL_SCHEMA,
  CQL_HOST: process.env.ONBOARD_CQL_HOST,

  GOOGLE_OAUTH_CREDENTIALS: process.env.ONBOARD_GOOGLE_OAUTH_CREDENTIALS,
  GOOGLE_OAUTH_REDIRECT_URI: process.env.ONBOARD_GOOGLE_OAUTH_REDIRECT_URI,

  TESTING: process.env.TESTING,

  getKeyspace(): string {
    return this.TESTING ? this.CQL_SCHEMA + '_test' : this.CQL_SCHEMA
  },
}

console.log('Config:', JSON.stringify(config, null, 2))

export default config
