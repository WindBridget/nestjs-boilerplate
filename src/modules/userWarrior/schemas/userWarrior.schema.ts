import { UserWarriorSkill } from './../../skill/schemas/userWarriorSkill.schema';
import { EUserWarriorStatus } from 'common/constant/gameConstants';
import GraphQLJSON from 'graphql-type-json';
import { Warrior } from 'modules/warrior/schemas/warrior.schema';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserWarrior extends Typegoose {
  @Field()
  // @Authorized([roles.ADMIN])
  _id: string;

  @prop({ required: false })
  @Field({ nullable: true })
  userId: string;

  @prop({ required: false })
  @Field({ nullable: true })
  walletAddress: string;

  @prop()
  @Field(() => GraphQLJSON)
  warrior: Warrior;

  @prop()
  @Field(() => GraphQLJSON)
  skill: UserWarriorSkill;

  @prop()
  @Field()
  level: number;

  @prop({ default: 0 })
  @Field()
  levelExp: number;

  @prop({ default: 0 })
  @Field()
  totalExp: number;

  @prop()
  @Field()
  damage: number;

  @prop()
  @Field()
  attackSpeed: number;

  @prop()
  @Field()
  price: number;

  @prop()
  @Field()
  isLocked: boolean;

  @prop({ default: EUserWarriorStatus.OWNED })
  @Field()
  status: string;

  @prop()
  @Field()
  creatationTime: Date;

  @prop({ unique: true, sparse: true })
  @Field()
  nftToken?: number;

  @prop({ unique: true, sparse: true })
  @Field({ nullable: true })
  nftId: number;

  @prop({ required: false })
  @Field({ nullable: true })
  mintTransactionHash?: string;

  @prop({ required: false })
  @Field({ nullable: true })
  sellOrder?: string;

  @prop({ required: false })
  @Field({ nullable: true })
  signature?: string;

  @prop()
  @Field()
  isPutOnMarket: boolean;

  @prop({ default: 1000 })
  @Field({ nullable: true })
  royalties: number;

  @prop()
  @Field({ nullable: true })
  totalQuantity: number;

  @prop({ default: 1000 })
  @Field({ nullable: true })
  health: number;

  @prop({ default: 100 })
  @Field({ nullable: true })
  mana: number;

  @prop()
  @Field({ nullable: true })
  receivedExp: number;
}

export const UserWarriorModel = new UserWarrior().getModelForClass(
  UserWarrior,
  {
    schemaOptions: { timestamps: true },
  },
);
