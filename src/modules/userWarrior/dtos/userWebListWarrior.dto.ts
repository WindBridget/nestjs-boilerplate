import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { UserWarriorItemDto } from './userWarriorItem.dto';

@ObjectType()
export class UserWebListWarriorDto extends DtoMapper {
  @Field(() => [UserWarriorItemDto], { defaultValue: [] })
  @MapFrom()
  warriors: UserWarriorItemDto[];

  @Field({ nullable: true })
  @MapFrom()
  page: number;

  @Field({ nullable: true })
  @MapFrom()
  limit: number;

  @Field({ nullable: true })
  @MapFrom()
  totalPage: number;

  @Field({ nullable: true })
  @MapFrom()
  total: number;
}
