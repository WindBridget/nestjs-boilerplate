import { IsString } from 'class-validator';
import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CampaignInfoDto extends DtoMapper {
  @MapFrom()
  @Field()
  stage: number;

  @MapFrom()
  @Field(() => [RewardResourceItemDto], { defaultValue: []})
  rewards: RewardResourceItemDto[];

  @MapFrom()
  @Field()
  description: string;

  @MapFrom()
  @Field()
  canStart: boolean;
}
