import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class OrderDto extends DtoMapper {
  @MapFrom()
  @Field()
  price: number;

  @MapFrom()
  @Field()
  nftId: number;

  @MapFrom()
  @Field()
  status: number;
}
