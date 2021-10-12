import { Query, Resolver } from '@nestjs/graphql';
import { WarriorService } from '../warrior/warrior.service';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Warrior } from 'modules/warrior/schemas/warrior.schema';
import { WeeklyBodyPartDto } from './dtos/weeklyBodyPart.dto';

@Resolver('WarriorBodyPart')
export class WarriorBodyPartResolver {
  private readonly logger = new BackendLogger(WarriorBodyPartResolver.name);

  constructor(
    private readonly warriorService: WarriorService,
  ) {}

  @Query(() => WeeklyBodyPartDto)
  async weeklyBodyPart() {
    const warriors = await this.warriorService.getWeeklyWarriors();
    const result = new WeeklyBodyPartDto();
    warriors.map((warrior) => {
      result.heads.push(warrior.head);
      result.sholders.push(warrior.sholder);
      result.rightHands.push(warrior.rightHand);
      result.leftHands.push(warrior.leftHand);
      result.rightWeapons.push(warrior.rightWeapon);
      result.leftWeapons.push(warrior.leftWeapon);
      result.bodys.push(warrior.body);
      result.legs.push(warrior.leg);
      result.skills.push(warrior.skill);
    });
    return result;
  }

  @Query(() => [Warrior])
  async weeklyWarriors() {
    return this.warriorService.getWeeklyWarriors();
  }
}
