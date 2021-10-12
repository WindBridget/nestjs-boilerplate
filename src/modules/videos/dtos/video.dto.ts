import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class VideoDto {
  @Field()
  id: string;

  @Field()
  description: string;
}
