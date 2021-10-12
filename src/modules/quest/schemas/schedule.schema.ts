import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Schedule extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  eventId: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  status: string;

  @prop({ default: new Date() })
  @Field()
  lastExecutionAt: Date;

  @prop({ default: new Date() })
  @Field()
  nextExecutionAt: Date;

  @prop()
  @Field()
  duration: number;

  @prop()
  @Field()
  eventDuration: number;
}

export const ScheduleModel = new Schedule().getModelForClass(Schedule, {});
