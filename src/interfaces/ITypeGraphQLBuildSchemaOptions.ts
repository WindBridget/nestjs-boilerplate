import { AuthChecker, BuildSchemaOptions } from 'type-graphql';

export interface TypeGraphQLBuildSchemaOptions extends BuildSchemaOptions {
  authChecker: AuthChecker<any, any>;
}
