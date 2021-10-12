import { roles } from 'common/constant/constants';
import { Authorized, Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Bundle extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  priority: number;
}

export const BundleModel = new Bundle().getModelForClass(Bundle, {
  schemaOptions: { timestamps: true },
});
