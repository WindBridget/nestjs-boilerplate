import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class WeeklyBodyPartDto {
  constructor() {
    this.heads = [];
    this.sholders = [];
    this.leftHands = [];
    this.rightHands = [];
    this.leftWeapons = [];
    this.rightWeapons = [];
    this.bodys = [];
    this.legs = [];
    this.skills = [];
  }

  @Field(() => [String])
  heads: string[];

  @Field(() => [String])
  sholders: string[];

  @Field(() => [String])
  leftHands: string[];

  @Field(() => [String])
  rightHands: string[];

  @Field(() => [String])
  rightWeapons: string[];

  @Field(() => [String])
  leftWeapons: string[];

  @Field(() => [String])
  bodys: string[];

  @Field(() => [String])
  legs: string[];

  @Field(() => [String])
  skills: string[];
}
