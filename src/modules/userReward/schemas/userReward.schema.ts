import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserReward extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  userId: string;

  @prop({ default: '' })
  @Field()
  questId: string;

  @prop({ default: false })
  @Field()
  hasClaimed: string;

  @prop()
  @Field()
  rewardId: string;

  @prop({ default: null })
  @Field()
  expireAt: Date;
}

export const UserRewardModel = new UserReward().getModelForClass(UserReward, {
  schemaOptions: { timestamps: true },
});
