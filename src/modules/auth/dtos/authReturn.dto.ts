import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthReturnDto extends DtoMapper {
  @Field()
  @MapFrom()
  _id: string;

  @Field({ nullable: true })
  @MapFrom()
  email: string;

  @Field()
  @MapFrom()
  status: string;
}
