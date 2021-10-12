import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserRewardDto {
  @Field()
  userId: string;

  @Field({ nullable: true })
  questId: string;

  @Field({ nullable: true })
  hasClaimed: string;

  @Field()
  rewardId: string;

  @Field({ nullable: true })
  expireAt: Date;
}
