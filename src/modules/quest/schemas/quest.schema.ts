import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Quest extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  eventId: string;

  @prop()
  @Field()
  name: string;

  @prop({ default: '' })
  @Field({ nullable: true })
  code: string;

  @prop()
  @Field()
  type: string;

  @prop({ default: '' })
  @Field({ nullable: true })
  scheduleCode: string;

  @prop({ default: '' })
  @Field({ nullable: true })
  description: string;

  @prop()
  @Field()
  status: string;

  @prop()
  @Field()
  rewardId: string;

  @prop({ default: 0 })
  @Field()
  value: number;
}

export const QuestModel = new Quest().getModelForClass(Quest, {});
