import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class SkillCreateDto {

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  element: string;

  @Field()
  range: number;

  @Field()
  specialEffect: string;

  @Field()
  animEffect?: string;
}
