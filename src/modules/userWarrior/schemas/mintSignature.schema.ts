import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class MintSignature extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop({ unique: true, sparse: true })
  @Field()
  nftToken?: number;

  @prop()
  @Field()
  isMinted: boolean;

  @prop()
  @Field({ nullable: true })
  v?: number;

  @prop()
  @Field({ nullable: true })
  r?: string;

  @prop()
  @Field({ nullable: true })
  s?: string;
}

export const UserWarriorModel = new MintSignature().getModelForClass(
  MintSignature,
  {
    schemaOptions: { timestamps: true },
  },
);
