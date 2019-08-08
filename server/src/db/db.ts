import Cassandra from 'cassandra-driver'
import C from '../config'

let client: Cassandra.Client

export function getClient(): Cassandra.Client {
  if (client) {
    return client
  }
  client = new Cassandra.Client({
    contactPoints: [C.ONBOARD_CQL_HOST],
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
