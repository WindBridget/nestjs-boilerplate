import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserResourceItemDto extends DtoMapper {
  @MapFrom()
  @Field({ nullable: true })
  _id: string;

  @MapFrom('resource.name')
  @Field({ nullable: true })
  name: string;

  @MapFrom('resource.code')
  @Field({ nullable: true })
  code: string;

  @MapFrom('resource.type')
  @Field({ nullable: true })
  type: string;

  @MapFrom('resource.element')
  @Field({ nullable: true })
  element: string;

  @MapFrom('resource.exp')
  @Field({ nullable: true })
  exp: number;

  @MapFrom('resource.coinCost')
  @Field({ nullable: true })
  coinCost: number;

  @MapFrom()
  @Field({ nullable: true })
  quantity: number;

  @MapFrom((data) => data.resource.coinCost * data.quantity)
  @Field({ nullable: true })
  totalCoin: number;
}
