import GraphQLJSON from 'graphql-type-json';
import { Resource } from 'modules/resource/schemas/resource.schema';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserResource extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field()
  userId?: string;

  @prop()
  @Field(() => GraphQLJSON)
  resource: Resource;

  @prop({ default: 0 })
  @Field()
  quantity: number;

  @Field()
  @prop({ default: 0 })
  increasePerMin: number;

  @prop()
  @Field()
  updatedAt: Date;

  @prop()
  @Field()
  createdAt: Date;
}

export const UserResourceModel = new UserResource().getModelForClass(
  UserResource,
  {
    schemaOptions: { timestamps: true },
  },
);
