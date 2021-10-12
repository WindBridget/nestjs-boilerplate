import { IsEmail, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { WalletAddressScalar as WalletAddress } from 'common/scalars/wallet_address.scalar';

@ArgsType()
export class SignEmailDto {
  @Field(() => WalletAddress, { nullable: false })
  @IsString()
  walletAddress?: string;

  @Field({ nullable: false })
  @IsEmail({}, { message: 'Invalid email message format' })
  email?: string;

  @Field({ nullable: false })
  @IsString()
  password?: string;

  @Field({ nullable: false })
  isResend?: boolean;

}
