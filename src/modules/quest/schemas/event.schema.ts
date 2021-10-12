import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Event extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  code: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  description: string;

  @prop()
  @Field()
  status: string;

}

export const EventModel = new Event().getModelForClass(Event, {});
