import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateItemDto {
  @Field({ nullable: true })
  nftToken?: number;

  @Field({ nullable: true })
  mintTransactionHash?: string = '';

  @Field({ nullable: true })
  signature?: string = '';

  @Field({ nullable: true })
  sellOrder?: string = '';

  @Field()
  totalQuantity?: number = 1;

  @Field()
  isMarketOption?: number = 0;

  @Field({ nullable: true })
  expireBid?: number = 0;

  @Field({ nullable: true })
  minBid?: number = 0;

  @Field({ nullable: true })
  price?: number = 0;

  @Field({ nullable: true })
  royalties?: number = 10;

  @Field({ nullable: true })
  isPutOnMarket?: boolean;

  @Field({ nullable: true })
  contract?: string = '';

  @Field({ nullable: true })
  startBid?: Date = null;

}
