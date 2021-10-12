import { Field } from 'type-graphql';

export class WarriorCreateDto {
  @Field()
  name: string;

  @Field()
  head: string;

  @Field()
  sholder: string;

  @Field()
  leftHand: string;

  @Field()
  rightHand: string;

  @Field()
  body: string;

  @Field()
  leg: string;

  @Field()
  leftWeapon: string;

  @Field()
  rightWeapon: string;

  @Field()
  type: string;

  @Field()
  element: string;

  @Field()
  rarity: string;

  @Field()
  rareOrder?: number;

  @Field()
  role: string;

  @Field()
  status: string;

  @Field()
  releaseDate: Date;

  @Field()
  skill: string;

  @Field()
  spineJson: string;

  @Field()
  spineAtlas: string;

  @Field()
  spineImage: string;
}
