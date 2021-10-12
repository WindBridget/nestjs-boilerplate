import { IsEmail, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { WalletAddressScalar as WalletAddress } from 'common/scalars/wallet_address.scalar';

@ArgsType()
export class LoginByEmailDto {

  @Field({ nullable: false })
  @IsEmail({}, { message: 'Invalid email message format' })
  email?: string;

  @Field({ nullable: false })
  @IsString()
  password?: string;
}
