import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UpdateOrderPriceDto {
  @Field()
  orderId: string;

  @Field()
  price: number;
}
