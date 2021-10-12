import { ArgsType, Field, ObjectType } from 'type-graphql';
import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';

@ObjectType()
export class BeginnerLoginRewardDto extends DtoMapper {
  @MapFrom()
  @Field({ nullable: true })
  name: string;

  @MapFrom()
  @Field({ nullable: true })
  code?: string;

  @MapFrom()
  @Field({ nullable: true })
  type: string;

  @MapFrom()
  @Field({ nullable: true })
  scheduleCode: string;

  @MapFrom()
  @Field({ nullable: true })
  description?: string;

  @MapFrom()
  @Field({ nullable: true })
  status?: string;

  @MapFrom()
  @Field({ nullable: true })
  rewardId: string;

  @MapFrom()
  @Field({ nullable: true })
  value: number;

  @MapFrom()
  @Field({ nullable: true })
  hasClaimed: string;

  @MapFrom()
  @Field({ nullable: true })
  userRewardId: string;
}
