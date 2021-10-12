import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { StringValueNode } from 'graphql';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserWarriorSkillReturnDto extends DtoMapper {
  @MapFrom()
  @Field({ nullable: true })
  _id: string;

  @MapFrom()
  @Field({ nullable: true })
  damage: number;

  @MapFrom()
  @Field({ nullable: true })
  coolDown: number;

  @MapFrom()
  @Field({ nullable: true })
  userWarriorId: string;

  @MapFrom()
  @Field({ nullable: true })
  mana: number;

  @MapFrom()
  @Field({ nullable: true })
  level: number;

  @MapFrom()
  @Field({ nullable: true })
  maxLevel: number;

  @MapFrom(data => data.skill.name)
  @Field({ nullable: true })
  name: string;

  @MapFrom(data => data.skill.code)
  @Field({ nullable: true })
  code: string;

  @MapFrom(data => data.skill.range)
  @Field({ nullable: true })
  range: string;

  @MapFrom(data => data.skill.type)
  @Field({ nullable: true })
  type: string;

  @MapFrom(data => data.skill.element)
  @Field({ nullable: true })
  element: string;

  @MapFrom(data => data.skill.animEffect)
  @Field({ nullable: true })
  animEffect: string;

  @MapFrom(data => data.skill.Effect)
  @Field({ nullable: true })
  Effect: string;

  @MapFrom()
  @Field({ nullable: true })
  timeEffect: number;

  @MapFrom()
  @Field({ nullable: true })
  levelExp: number;

  @MapFrom()
  @Field({ nullable: true })
  totalExp: number;
}
