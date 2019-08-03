import Assert from 'assert'
import Dotenv from 'dotenv'

Dotenv.config()

Assert(process.env.ONBOARD_CQL_SCHEMA, 'missing env ONBOARD_CQL_SCHEMA')
Assert(process.env.ONBOARD_CQL_HOST, 'missing env ONBOARD_CQL_HOST')

export default {
  ONBOARD_CQL_SCHEMA: process.env.ONBOARD_CQL_SCHEMA,
  ONBOARD_CQL_HOST: process.env.ONBOARD_CQL_HOST,
  TESTING: process.env.TESTING,
  getKeyspace(): string {
    return this.TESTING
      ? this.ONBOARD_CQL_SCHEMA + '_test'
      : this.ONBOARD_CQL_SCHEMA
  },
}
