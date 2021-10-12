import { IsEmail } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class ForgotPasswordDto {
  @Field({ nullable: false })
  @IsEmail({}, { message: 'Invalid email message format' })
  email?: string;
}
