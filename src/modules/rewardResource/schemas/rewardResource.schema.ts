import GraphQLJSON from 'graphql-type-json';
import { Resource } from 'modules/resource/schemas/resource.schema';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class RewardResource extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop()
  @Field(() => GraphQLJSON)
  resource: Resource;

  @prop()
  @Field()
  value: number;
}

export const RewardResourceModel = new RewardResource().getModelForClass(
  RewardResource,
  {
    schemaOptions: { timestamps: true },
  },
);
