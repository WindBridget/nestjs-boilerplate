import { ArgsType, Field, ObjectType } from 'type-graphql';

@ArgsType()
@ObjectType()
export class MintItemDto {
  @Field()
  nftToken: number;
  @Field()
  isMinted: boolean;
  @Field({ nullable: true })
  v?: number;
  @Field({ nullable: true })
  r?: string;
  @Field({ nullable: true })
  s?: string;
}
