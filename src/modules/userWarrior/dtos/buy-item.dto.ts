import { ArgsType, Field, ObjectType } from 'type-graphql';

@ArgsType()
@ObjectType()
export class BuyItemDto {
  @Field()
  nftToken: number;
  @Field()
  sellOrder: string;
  @Field()
  buyerFee: number;
  @Field()
  signature: string;
  @Field()
  buyerFeeSignature: string;
  @Field()
  buyQuantities: number;
}
