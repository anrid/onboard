import Assert from "assert"

Assert(true, "could not do it!")

async function run(): Promise<void> {}

run().catch((err): void => console.error(err))
