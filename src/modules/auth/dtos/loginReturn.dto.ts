import { MapFrom } from 'common/dto/BaseDtoMapper';
import { UserReturnDto } from 'modules/user/dtos/userReturn.dto';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginReturnDto extends UserReturnDto {
  @Field()
  @MapFrom()
  expiresIn: string;

  @Field()
  @MapFrom()
  accessToken: string;

}
