import GraphQLJSON from 'graphql-type-json';
import { RewardResource } from 'modules/rewardResource/schemas/rewardResource.schema';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Reward extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field()
  isAutoClaim: boolean;

  @prop()
  @Field(() => [GraphQLJSON])
  rewardResources: RewardResource[];

  @prop()
  @Field()
  updatedAt: Date;

  @prop()
  @Field()
  createdAt: Date;
}

export const RewardModel = new Reward().getModelForClass(Reward, {
  schemaOptions: { timestamps: true },
});
