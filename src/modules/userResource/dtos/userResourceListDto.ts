import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { UserResourceItemDto } from './userResourceItemDto';
import { UserResourceReturnDto } from './userResourceReturn.dto';

@ObjectType()
export class UserResourceListDto extends DtoMapper {
  @Field(() => [UserResourceItemDto], { defaultValue: [] })
  @MapFrom()
  resources: UserResourceItemDto[];

  @Field({ nullable: true })
  @MapFrom()
  firstResource: UserResourceReturnDto;
}
