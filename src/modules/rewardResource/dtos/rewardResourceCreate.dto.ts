import { Resource } from 'modules/resource/schemas/resource.schema';
import { ArgsType, Field, InputType } from 'type-graphql';

@ArgsType()
@InputType()
export class RewardResourceCreateDto {
  @Field()
  resourceCode: string;

  @Field()
  value: number;
}
