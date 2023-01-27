import { Pool } from '@neondatabase/serverless';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { DB } from 'kysely-codegen';

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
};
    
export default async (req: Request) => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({connectionString: process.env.DATABASE_URL})
    })
  });

  const longitude = parseFloat(req.headers.get('x-vercel-ip-longitude') ?? '-122.47');
  const latitude = parseFloat(req.headers.get('x-vercel-ip-latitude') ?? '37.81');
  const distance = sql<number>`location <-> st_makepoint(${longitude}, ${latitude})`;

  const sites = await db
    .selectFrom('whc_sites_2021')
    .select(['id_no', 'name_en', 'category', distance.as('distance')])
    .orderBy(distance)
    .limit(10)
    .execute();

  return new Response(JSON.stringify(sites, null, 2));
}
