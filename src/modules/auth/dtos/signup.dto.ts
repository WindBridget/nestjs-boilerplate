import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { WalletAddressScalar as WalletAddress } from 'common/scalars/wallet_address.scalar';

@ArgsType()
export class SignupDto {
  @Field(() => WalletAddress, { nullable: false })
  @IsString()
  walletAddress?: string;

  status?: string;
}