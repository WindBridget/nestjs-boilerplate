import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Skill extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field({ nullable: true })
  code: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  range: number;

  @prop()
  @Field({ nullable: true })
  type: string;

  @prop()
  @Field({ nullable: true })
  element: string;

  @prop()
  @Field()
  Effect: string;

  @prop()
  @Field()
  animEffect: string;
}
