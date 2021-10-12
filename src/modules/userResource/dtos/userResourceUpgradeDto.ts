import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { UserResourceItemDto } from './userResourceItemDto';

@ObjectType()
export class UserResourceUpgradeDto extends DtoMapper {
  @Field(() => [UserResourceItemDto], { defaultValue: [] })
  @MapFrom()
  resources: UserResourceItemDto[];

  @Field({ nullable: true })
  @MapFrom()
  totalCoin: number;
}
