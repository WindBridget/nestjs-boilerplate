import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class ResourceDto {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  element: string;

  @Field()
  type: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  exp: number;

  @Field({ nullable: true })
  coinCost: number;
}
