import Commander from 'commander'
import * as TestHelper from '../test_helper'
import * as SetupDb from '../db/setup'

const program = new Commander.Command()
program.version('0.0.1')

program
  .command('reset-test-db')
  .description('drops the test keyspace and recreates it')
  .action(
    async (): Promise<void> => {
      console.log('Dropping and rebuilding test keyspace.')
      await TestHelper.setupDb(true)
    },
  )

program
  .command('reset-db')
  .description('drops the keyspace and recreates it')
  .action(
    async (): Promise<void> => {
      console.log('Dropping and rebuilding keyspace.')
      await SetupDb.run()
    },
  )

program.parse(process.argv)

if (process.argv.length == 2) {
  program.help()
}
