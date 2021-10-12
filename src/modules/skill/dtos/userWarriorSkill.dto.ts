import { Skill } from 'modules/skill/schemas/skill.schema';

import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserWarriorSkillDto {
  @Field()
  damage: number;

  @Field()
  coolDown: number;

  @Field()
  userWarriorId: string;

  @Field()
  mana: number;

  @Field()
  level: number;

  @Field()
  maxLevel: number;

  @Field()
  skill: Skill;

  @Field()
  timeEffect: number;
}
