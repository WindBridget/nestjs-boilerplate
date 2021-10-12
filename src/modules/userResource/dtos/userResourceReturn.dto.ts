import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserResourceReturnDto extends DtoMapper {

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

  @MapFrom()
  @Field({ nullable: true })
  quantity: number;
}
