import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserQuest extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  userId: string;

  @prop()
  @Field()
  questType: string;

  @prop()
  @Field()
  status: string;

  @prop({ default: 0 })
  @Field()
  current: number;

  @prop({ default: 0 })
  @Field()
  requireTotal: number;

  @prop()
  @Field()
  updatedAt: Date;

  @prop()
  @Field()
  createdAt: Date;
}

export const UserQuestModel = new UserQuest().getModelForClass(UserQuest, {
  schemaOptions: { timestamps: true },
});
