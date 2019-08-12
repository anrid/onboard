import Cassandra from 'cassandra-driver'
import C from '../config'

let client: Cassandra.Client

export function getClient(): Cassandra.Client {
  if (client) {
    return client
  }
  client = new Cassandra.Client({
    contactPoints: [C.CQL_HOST],
    localDataCenter: 'datacenter1',
  })
  return client
}

export async function mustExec(
  client: Cassandra.Client,
  cql: string,
): Promise<void> {
  try {
    await client.execute(cql)
  } catch (err) {
    console.log('Fatal:', err)
    process.exit(-1)
  }
}

export async function createKeyspace(
  client: Cassandra.Client,
  keyspace: string,
  drop: boolean,
): Promise<void> {
  if (drop) {
    console.log('Dropping keyspace:', keyspace)
    await mustExec(client, `DROP KEYSPACE IF EXISTS ${keyspace}`)
  }

  console.log('Creating keyspace:', keyspace)
  await mustExec(
    client,
    `
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
  `,
  )
}
