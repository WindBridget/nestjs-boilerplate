import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { User } from '../schemas/user.schema';
import { SlotDto } from './slot.dto';
import { UserReturnDto } from './userReturn.dto';

@ObjectType()
export class UserLobbyDto extends UserReturnDto {
  @Field(() => [SlotDto])
  @MapFrom((data: User) => {
    return data && data.team ? data.team.map((slot) => new SlotDto(slot)) : [];
  })
  team: SlotDto[];
}
