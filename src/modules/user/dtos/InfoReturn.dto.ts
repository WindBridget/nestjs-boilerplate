import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class InfoReturnDto extends DtoMapper {

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
  level: string;
}
