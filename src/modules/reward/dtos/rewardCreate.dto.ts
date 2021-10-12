import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class RewardCreateDto {
  @Field()
  type: string;

  @Field()
  description: string;

  @Field()
  isAutoClaim: boolean;
}
