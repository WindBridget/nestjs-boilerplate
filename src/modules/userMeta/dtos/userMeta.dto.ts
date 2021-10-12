import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserMetaDto {
  @Field()
  userId: string;

  @Field({ nullable: true })
  key: string;

  @Field({ nullable: true })
  value: number;

  @Field({ nullable: true })
  hasLoginToday: boolean;

  @Field({ nullable: true })
  lastLoginAt: Date;
}
