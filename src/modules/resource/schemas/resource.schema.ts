import { EResourceElement } from 'common/constant/gameConstants';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Resource extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  code: string;

  @prop({ default: EResourceElement.None })
  @Field()
  element: string;

  @prop()
  @Field()
  type: string;

  @prop({ required: false })
  @Field()
  exp: number;

  @prop({ required: false })
  @Field()
  coinCost: number;

  @prop()
  @Field()
  updatedAt: Date;

  @prop()
  @Field()
  createdAt: Date;

  @prop({ default: '' })
  @Field()
  description: string;
}

export const ResourceModel = new Resource().getModelForClass(Resource, {
  schemaOptions: { timestamps: true },
});
