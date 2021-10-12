import { MapFrom } from 'common/dto/BaseDtoMapper';
import { getLevelExp } from 'common/gameUtil';
import { UserWarriorSkillReturnDto } from 'modules/skill/dtos/userWarriorSkillReturn.dto';
import { Field, ObjectType } from 'type-graphql';
import { BaseUserWarriorItemDto } from './base/userWarriorItemBase.dto';

@ObjectType()
export class UserWarriorItemDto extends BaseUserWarriorItemDto {
  @MapFrom()
  @Field({ nullable: true })
  userId: string;

  @MapFrom()
  @Field({ nullable: true })
  walletAddress?: string;

  @MapFrom()
  @Field({ nullable: true })
  level: number;

  @MapFrom()
  @Field({ nullable: true })
  levelExp: number;

  @MapFrom((data) => getLevelExp(data.level))
  @Field({ nullable: true })
  totalLevelExp: number;

  @MapFrom()
  @Field({ nullable: true })
  totalExp: number;

  @MapFrom()
  @Field({ nullable: true })
  damage: number;

  @MapFrom()
  @Field({ nullable: true })
  attackSpeed: number;

  @MapFrom()
  @Field({ nullable: true })
  price: number;

  @MapFrom()
  @Field({ nullable: true })
  status: string;

  @MapFrom()
  @Field({ nullable: true })
  mintTransactionHash: string;

  @MapFrom()
  @Field({ nullable: true })
  sellOrder: string;

  @MapFrom()
  @Field({ nullable: true })
  signature: string;

  @MapFrom()
  @Field({ nullable: true })
  nftToken?: number;

  @MapFrom()
  @Field({ nullable: true })
  isPutOnMarket?: boolean;

  @MapFrom()
  @Field({ nullable: true })
  royalties?: number;

  @MapFrom()
  @Field({ nullable: true })
  totalQuantity?: number;

  @MapFrom((data) => data.mana)
  @Field({ nullable: true })
  mana?: number;

  @MapFrom((data) => data.health)
  @Field({ nullable: true })
  health?: number;

  @MapFrom()
  @Field({ nullable: true })
  receivedExp?: number;

  @Field(() => UserWarriorSkillReturnDto, { nullable: true })
  @MapFrom(data => new UserWarriorSkillReturnDto(data.skill))
  skill: UserWarriorSkillReturnDto;

  @Field({ nullable: true })
  @MapFrom()
  nftId: string;

  // @prop({ default: null })
  // @Field(() => GraphQLJSON, { nullable: true })
  // userWarrior: UserWarrior;
}
