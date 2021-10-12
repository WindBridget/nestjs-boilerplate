import { UserWarriorSkillReturnDto } from 'modules/skill/dtos/userWarriorSkillReturn.dto';
import { DtoMapper, MapFrom } from 'common/dto/BaseDtoMapper';
import { Field, ObjectType } from 'type-graphql';
import { Slot } from '../schemas/slot.schema';

@ObjectType()
export class SlotDto extends DtoMapper {
  @MapFrom((data: Slot) => (data.userWarrior ? data.userWarrior._id : null))
  @Field({ nullable: true })
  userWarriorId: string;

  @MapFrom()
  @Field({ nullable: true })
  name: string;

  @MapFrom()
  @Field({ nullable: true })
  code: string;

  @MapFrom((data: Slot) => (data.userWarrior ? data.userWarrior.level : null))
  @Field({ nullable: true })
  level: number;

  @MapFrom((data: Slot) => (data.userWarrior ? data.userWarrior.damage : null))
  @Field({ nullable: true })
  damage: number;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.attackSpeed : null,
  )
  @Field({ nullable: true })
  attackSpeed: number;

  @MapFrom((data: Slot) => (data.userWarrior ? data.userWarrior.status : null))
  @Field({ nullable: true })
  status: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.name : null,
  )
  @Field({ nullable: true })
  warriorName: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.head : null,
  )
  @Field({ nullable: true })
  head: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.sholder : null,
  )
  @Field({ nullable: true })
  sholder: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.leftHand : null,
  )
  @Field({ nullable: true })
  leftHand: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.rightHand : null,
  )
  @Field({ nullable: true })
  rightHand: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.body : null,
  )
  @Field({ nullable: true })
  body: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.leg : null,
  )
  @Field({ nullable: true })
  leg: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.leftWeapon : null,
  )
  @Field({ nullable: true })
  leftWeapon: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.rightWeapon : null,
  )
  @Field({ nullable: true })
  rightWeapon: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.type : null,
  )
  @Field({ nullable: true })
  type: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.element : null,
  )
  @Field({ nullable: true })
  element: string;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.warrior.rarity : null,
  )
  @Field({ nullable: true })
  rarity: string;

  // @MapFrom((data: Slot) =>
  //   data.userWarrior ? data.userWarrior.warrior.skill : null,
  // )

  @MapFrom((data: Slot) => new UserWarriorSkillReturnDto(data.userWarrior.skill))
  @Field(() => UserWarriorSkillReturnDto, { nullable: true })
  skill: UserWarriorSkillReturnDto;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.health : null,
  )
  @Field({ nullable: true })
  health: number;

  @MapFrom((data: Slot) =>
    data.userWarrior ? data.userWarrior.mana : null,
  )
  @Field({ nullable: true })
  mana: number;
}
