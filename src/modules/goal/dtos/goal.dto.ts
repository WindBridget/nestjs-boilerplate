import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class GoalDto {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  start: number;

  @Field()
  end: number;

  @Field()
  rewardId: string;
}
