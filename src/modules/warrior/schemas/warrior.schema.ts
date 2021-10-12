import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class Warrior extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  nftId: number;

  @prop()
  @Field()
  name: string;

  @prop()
  @Field()
  head: string;

  @prop()
  @Field()
  sholder: string;

  @prop()
  @Field()
  leftHand: string;

  @prop()
  @Field()
  rightHand: string;

  @prop()
  @Field()
  body: string;

  @prop()
  @Field()
  leg: string;

  @prop()
  @Field()
  leftWeapon: string;

  @prop()
  @Field()
  rightWeapon: string;

  @prop()
  @Field()
  type: string;

  @prop()
  @Field()
  element: string;

  @prop()
  @Field()
  rarity: string;

  @prop()
  @Field()
  rareOrder: number;

  @prop()
  @Field()
  role: string;

  @prop()
  @Field()
  status: string;

  @prop()
  @Field({ nullable: true })
  skill: string;

  // @prop()
  // @Field(() => GraphQLJSON)
  // skill: Skill;

  @prop({ default: new Date() })
  @Field()
  releaseDate: Date;

  @prop()
  @Field()
  spineJson: string;

  @prop()
  @Field()
  spineAtlas: string;

  @prop()
  @Field()
  spineImage: string;
}

export const WarriorModel = new Warrior().getModelForClass(Warrior, {
  schemaOptions: { timestamps: false },
});
