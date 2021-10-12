import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class EventDto {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field()
  status: string;
}
