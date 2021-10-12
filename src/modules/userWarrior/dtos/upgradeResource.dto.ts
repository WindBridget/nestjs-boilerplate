import { ArgsType, Field, InputType } from 'type-graphql';

@ArgsType()
@InputType()
export class UpgradeResourceDto {
  @Field()
  resourceCode: string;

  @Field()
  value: number;
}
