import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class BetaAccount extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  telegram: string;

  @prop()
  @Field()
  walletAddress: string;
}

export const BetaAccountModel = new BetaAccount().getModelForClass(
  BetaAccount,
  {
    schemaOptions: { timestamps: true },
  },
);
