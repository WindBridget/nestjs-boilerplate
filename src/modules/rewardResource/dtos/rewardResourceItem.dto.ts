import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
@ObjectType()
export class RewardResourceItemDto extends DtoMapper {
  @Field({ nullable: true })
  @MapFrom('resource.name')
  name: string;

  @Field({ nullable: true })
  @MapFrom('resource.code')
  code: string;

  @Field({ nullable: true })
  @MapFrom('resource.type')
  type: string;

  @Field({ nullable: true })
  @MapFrom('resource.element')
  element: string;

  @Field({ nullable: true })
  @MapFrom('resource.exp')
  exp: number;

  @Field({ nullable: true })
  @MapFrom('resource.coinCost')
  coinCost: number;

  @Field({ nullable: true })
  @MapFrom()
  value: number;
}
