import * as App from './app'

async function run(): Promise<void> {
  const app = App.create()
  app.start()
}

run().catch((err): void => console.error(err))
