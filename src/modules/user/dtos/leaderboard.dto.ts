import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LeaderboardDto extends DtoMapper {
  @Field()
  @MapFrom()
  rank: number;

  @Field()
  @MapFrom()
  name: string;

  @Field({ nullable: true })
  @MapFrom()
  campaignStage: number;

  @Field({ nullable: true })
  @MapFrom()
  timeFinishStage: number;

  @Field(() => [RewardResourceItemDto], { defaultValue: [] })
  @MapFrom()
  rewards: RewardResourceItemDto[];
}
