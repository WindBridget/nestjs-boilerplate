import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { UserWarriorItemDto } from './userWarriorItem.dto';

@ObjectType()
export class UserListWarriorDto extends DtoMapper {
  @Field(() => [UserWarriorItemDto], { defaultValue: [] })
  @MapFrom()
  warriors: UserWarriorItemDto[];

  @Field({ nullable: true })
  @MapFrom()
  firstPlayer: UserWarriorItemDto;
}
