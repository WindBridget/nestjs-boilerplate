import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Campaign extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  stage: number;

  @prop()
  @Field()
  rewardId: string;

  @prop({ default: ''})
  @Field()
  description: string;

  @prop()
  @Field()
  type: string;
}

export const CampaignModel = new Campaign().getModelForClass(Campaign, {
  schemaOptions: { timestamps: true },
});
