import GraphQLJSON from 'graphql-type-json';
import { UserWarrior } from 'modules/userWarrior/schemas/userWarrior.schema';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Slot extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  code: string;

  @prop()
  @Field()
  index: number;

  @prop({ default: null })
  @Field(() => GraphQLJSON, { nullable: true })
  userWarrior: UserWarrior;
}

export const SlotModel = new Slot().getModelForClass(Slot, {
  schemaOptions: { timestamps: true },
});
