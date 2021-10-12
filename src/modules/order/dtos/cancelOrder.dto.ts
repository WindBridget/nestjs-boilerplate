import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CancelOrderDto {
  @Field()
  orderId: string;
}
