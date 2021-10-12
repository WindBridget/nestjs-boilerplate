import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class WarriorRandomCreateDto {
  @Field()
  quantity: number;

  @Field({ nullable: true })
  initRarity: string;

  @Field({ nullable: true })
  initRole: string;

  @Field({ nullable: true })
  initType: string;
}
