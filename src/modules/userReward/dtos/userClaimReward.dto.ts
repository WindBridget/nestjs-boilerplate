import { IsString } from 'class-validator';
import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ClaimRewardDto extends DtoMapper {
  @MapFrom()
  @Field(() => [RewardResourceItemDto], { defaultValue: [] })
  rewards: RewardResourceItemDto[];
}
