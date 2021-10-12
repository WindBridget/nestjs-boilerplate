import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CampaignDto {
  @Field()
  stage: number;

  @Field()
  rewardId: string;

  @Field()
  description: string;

  @Field()
  type: string;
}
