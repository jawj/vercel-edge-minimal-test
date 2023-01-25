
import { Client } from '@neondatabase/serverless';

export const config = {
  runtime: 'experimental-edge',
  regions: ['fra1'],
};

declare global {
  const process: { env: { DATABASE_URL: string } };
}

export default async (req: Request) => {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  const { rows: [{ now }] } = await client.query('select now();');
  await client.end();
  return new Response(now);
};

