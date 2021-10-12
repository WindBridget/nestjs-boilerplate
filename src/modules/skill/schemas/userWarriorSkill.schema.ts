import { Skill } from './skill.schema';
import { GraphQLJSON } from 'graphql-type-json';
import { Field, ObjectType } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';

@ObjectType()
export class UserWarriorSkill extends Typegoose {
  @Field()
  _id: string;

  @prop()
  @Field()
  userWarriorId: string;

  @prop()
  @Field(() => GraphQLJSON, { nullable: true })
  skill: Skill;

  @prop()
  @Field()
  damage: number;

  @prop()
  @Field()
  coolDown: number;

  @prop({ default: 1 })
  @Field()
  level: number;

  @prop()
  @Field()
  mana: number;

  @prop()
  @Field()
  timeEffect: number;

  @prop()
  @Field()
  maxLevel: number;

  @prop({ default: 0 })
  @Field()
  levelExp: number;

  @prop({ default: 0 })
  @Field()
  totalExp: number;

  @prop()
  @Field()
  receivedExp: number;
}
