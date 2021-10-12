import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class BaseUserWarriorItemDto extends DtoMapper {
  @MapFrom('_id')
  @Field({ nullable: true })
  userWarriorId: string;

  @MapFrom('warrior.name')
  @Field({ nullable: true })
  name: string;

  @MapFrom('warrior.head')
  @Field({ nullable: true })
  head: string;

  @MapFrom('warrior.sholder')
  @Field({ nullable: true })
  sholder: string;

  @MapFrom('warrior.leftHand')
  @Field({ nullable: true })
  leftHand: string;

  @MapFrom('warrior.rightHand')
  @Field({ nullable: true })
  rightHand: string;

  @MapFrom('warrior.body')
  @Field({ nullable: true })
  body: string;

  @MapFrom('warrior.leg')
  @Field({ nullable: true })
  leg: string;

  @MapFrom('warrior.leftWeapon')
  @Field({ nullable: true })
  leftWeapon: string;

  @MapFrom('warrior.rightWeapon')
  @Field({ nullable: true })
  rightWeapon: string;

  @MapFrom('warrior.type')
  @Field({ nullable: true })
  type: string;

  @MapFrom('warrior.element')
  @Field({ nullable: true })
  element: string;

  @MapFrom('warrior.rarity')
  @Field({ nullable: true })
  rarity: string;

  @MapFrom('warrior.rareOrder')
  @Field({ nullable: true })
  rareOrder: number;

  @MapFrom('warrior.role')
  @Field({ nullable: true })
  role: string;

  // @MapFrom('warrior.skill')
  // @Field({ nullable: true })
  // skill: string;

  @MapFrom('warrior.releaseDate')
  @Field({ nullable: true })
  releaseDate: Date;
}
