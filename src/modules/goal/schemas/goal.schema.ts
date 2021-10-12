import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Goal extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  start: number;

  @prop()
  @Field()
  end: number;

  @prop()
  @Field()
  rewardId: string;
}

export const GoalModel = new Goal().getModelForClass(Goal, {
  schemaOptions: { timestamps: true },
});
