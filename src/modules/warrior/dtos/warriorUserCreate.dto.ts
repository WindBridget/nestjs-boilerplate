import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class WarriorUserCreateDto {
  @Field()
  head: string;

  @Field()
  shoulder: string;

  @Field()
  leftHand: string;

  @Field()
  rightHand: string;

  @Field()
  body: string;

  @Field()
  leg: string;

  @Field()
  spineJson: string;

  @Field()
  spineAtlas: string;

  @Field()
  spineImage: string;
}
