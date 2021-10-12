import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ObjectType()
@ArgsType()
export class BundleDto extends DtoMapper {
  @Field()
  @MapFrom()
  name: string;

  @Field()
  @MapFrom()
  priority: number;
}
