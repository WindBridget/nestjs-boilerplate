import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserQuestDto {
  @Field()
  userId: string;

  // @Field()
  // questId: string;

  @Field()
  questType: string;

  @Field()
  status: string;

  @Field()
  current?: number;

  @Field()
  requireTotal?: number;
}
