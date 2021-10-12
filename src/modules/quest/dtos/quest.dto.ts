import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class QuestDto {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  code: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  status: string;

  @Field()
  rewardId: string;

  @Field()
  value: number;
}
