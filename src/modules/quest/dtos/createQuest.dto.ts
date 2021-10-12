import { ArgsType, Field, InputType } from 'type-graphql';

@ArgsType()
export class CreateQuestDto {
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
