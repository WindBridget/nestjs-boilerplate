import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateOrderDto {
  @Field()
  price: number;

  @Field()
  nftId: number;
}
