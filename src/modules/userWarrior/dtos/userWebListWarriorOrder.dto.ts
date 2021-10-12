import { Field, ObjectType } from 'type-graphql';
import { DtoMapper, MapFrom } from '../../../common/dto/BaseDtoMapper';
import { UserWarriorOrderDto } from './userWarriorOrder.dto';

@ObjectType()
export class UserWebListWarriorOrderDto extends DtoMapper {
  @Field(() => [UserWarriorOrderDto], { defaultValue: [] })
  @MapFrom()
  warriors: UserWarriorOrderDto[];

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
