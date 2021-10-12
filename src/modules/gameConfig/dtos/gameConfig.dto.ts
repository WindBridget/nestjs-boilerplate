
import { ArgsType, Field } from 'type-graphql';
@ArgsType()
export class GameConfigDto {
  @Field()
  key: string;

  @Field()
  value: string;

  @Field()
  description: string;
}
