import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserWarriorRequestDto {
  @Field()
  sortBy: string;

  @Field()
  orderBy: string;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field(() => [String], { defaultValue: [] })
  type: string[];

  @Field(() => [String], { defaultValue: [] })
  element: string[];

  @Field(() => [String], { defaultValue: [] })
  rarity: string[];

  @Field(() => [String], { defaultValue: [] })
  role: string[];

  @Field({ nullable: true })
  userId: string;
}
