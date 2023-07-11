import { Injectable } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from './types';
import { DatabaseConfig } from '../config/database.config';

const dialect = new PostgresDialect({
  pool: new Pool({ connectionString: DatabaseConfig.databaseUrl }),
});

@Injectable()
export class KyselyService extends Kysely<DB> {
  constructor() {
    super({ dialect });
  }
}
