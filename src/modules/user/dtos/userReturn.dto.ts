import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserReturnDto extends DtoMapper {
  @Field()
  @MapFrom()
  _id: string;

  @Field({ nullable: true })
  @MapFrom()
  email: string;

  @Field()
  @MapFrom()
  name: string;

  @Field()
  @MapFrom()
  avatarCode: string;

  @Field({ nullable: true, defaultValue: 1 })
  @MapFrom()
  campaignStage: number;

  @Field()
  @MapFrom()
  timeFinishStage: number;

  @Field()
  @MapFrom()
  status: string;

  @Field()
  @MapFrom()
  health: number;

  @Field()
  @MapFrom()
  mana: number;

  @Field()
  @MapFrom()
  energy: number;
}
