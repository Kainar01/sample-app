import { join } from 'path';

import { get } from 'env-var';

export class GraphQLConfig {
  public static readonly debug: boolean = get('GRAPHQL_DEBUG').default('false').asBool();

  public static readonly playground: boolean = get('GRAPHQL_PLAYGROUND').default('false').asBool();

  public static readonly autoSchemaFile: string = get('GRAPHQL_SCHEMA_DEST')
    .default(join(process.cwd(), 'apps/server/src/schema.graphql'))
    .asString();
}
