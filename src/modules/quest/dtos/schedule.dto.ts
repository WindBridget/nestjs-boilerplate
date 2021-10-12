import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class ScheduleDto {

  @Field()
  eventId: string;

  @Field()
  type?: string;

  @Field()
  duration: number;

  @Field()
  eventDuration: number;
}
