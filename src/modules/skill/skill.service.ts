import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getLevelExp, getRandom } from 'common/gameUtil';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Skill } from 'modules/skill/schemas/skill.schema';
import { UserResourceRepository } from 'modules/userResource/userResource.repository';
import { UpgradeResourceDto } from 'modules/userWarrior/dtos/upgradeResource.dto';
import { EResourceCode } from './../../common/constant/gameConstants';
import { UserWarriorService } from './../userWarrior/userWarrior.service';
import { SkillCreateDto } from './dtos/skill.dto';
import { UserWarriorSkillDto } from './dtos/userWarriorSkill.dto';
import { UserWarriorSkillReturnDto } from './dtos/userWarriorSkillReturn.dto';
import { UserWarriorSkill } from './schemas/userWarriorSkill.schema';
import { SkillRepository } from './skill.repository';

@Injectable()
export class SkillService {
  private readonly logger = new BackendLogger(SkillService.name);

  constructor(
    private readonly skillRepository: SkillRepository,
    private readonly userResourceRepository: UserResourceRepository,
    @Inject(forwardRef(() => UserWarriorService))
    private readonly userWarriorService: UserWarriorService,
    // @Inject(forwardRef(() => UserService))
    // private readonly userService: UserService,
  ) { }

  async createSkill(skill: SkillCreateDto) {
    return await this.skillRepository.createSkill(skill);
  }

  async getRandomSkill(
    type: string,
    element: string,
  ): Promise<Skill> {
    const range = getRandom([1, 4, 7]);
    return this.skillRepository.getSkill(type, element, range);
  }

  async generateUserWarriorSkill(
    userWarriorId: string,
    skill: Skill,
    rarity: string,
  ): Promise<UserWarriorSkill> {
    let data: UserWarriorSkillDto;
    switch (rarity) {
      case 'COMMON':
        data = {
          userWarriorId,
          damage: Math.random() * (50 - 30) + 30,
          coolDown: Math.random() * (50 - 45) + 45,
          mana: Math.random() * (30 - 20) + 20,
          level: 1,
          skill,
          maxLevel: 3,
          timeEffect: 1,
        };
      case 'RARE':
        data = {
          userWarriorId,
          damage: Math.random() * (50 - 30) + 30,
          coolDown: Math.random() * (50 - 45) + 45,
          mana: Math.random() * (30 - 20) + 20,
          level: 1,
          skill,
          maxLevel: 5,
          timeEffect: Math.random() * (2 - 1) + 1,
        };
      case 'EPIC':
        data = {
          userWarriorId,
          damage: Math.random() * (50 - 30) + 30,
          coolDown: Math.random() * (50 - 45) + 45,
          mana: Math.random() * (30 - 20) + 20,
          level: 1,
          skill,
          maxLevel: 7,
          timeEffect: Math.random() * (3 - 2) + 2,

        };
      case 'LEGEND':
        data = {
          userWarriorId,
          damage: Math.random() * (150 - 100) + 100,
          coolDown: Math.random() * (30 - 20) + 20,
          mana: Math.random() * (50 - 40) + 40,
          level: 1,
          skill,
          maxLevel: 7,
          timeEffect: Math.random() * (5 - 3) + 3,
        };
    }
    return await this.skillRepository.createUserWarriorSkill(data);
  }

  async upgradeSkill(
    userId: string,
    userWarriorSkillId: string,
    totalCoin: number,
    upgradeResourceDtos: UpgradeResourceDto[],
  ): Promise<UserWarriorSkillReturnDto> {
    let exp = 0;
    upgradeResourceDtos.map(async (upgradeResource) => {
      const userResource =
        await this.userResourceRepository.applyResourceByCodeAndValue(
          userId,
          upgradeResource.resourceCode,
          -upgradeResource.value,
        );
      exp += userResource.resource.exp * upgradeResource.value;
    });
    this.logger.log(`${exp} => experiance`);
    await this.userResourceRepository.applyResourceByCodeAndValue(
      userId,
      EResourceCode.COIN,
      -totalCoin,
    );
    const userWarriorSkill = await this.applyExp(userWarriorSkillId, exp);
    await this.userWarriorService.findByIdAndUpdate(userWarriorSkill.userWarriorId, { skill: userWarriorSkill });
    return new UserWarriorSkillReturnDto(userWarriorSkill);
  }

  async applyExp(userWarriorSkillId: string, exp: number): Promise<UserWarriorSkill> {
    const userWarriorSkill = await this.skillRepository.findByIdAndUpdate(userWarriorSkillId, {
      $inc: {
        levelExp: exp,
        totalExp: exp,
      },
    });
    return await this.levelUp(userWarriorSkill);
  }

  async levelUp(userWarriorSkill: UserWarriorSkill): Promise<UserWarriorSkill> {
    const expRequired = getLevelExp(userWarriorSkill.level);
    if (expRequired > userWarriorSkill.levelExp) {
      this.logger.error(
        `not enough exp ${userWarriorSkill.levelExp}/${expRequired}.`,
        'levelUp',
      );
      return userWarriorSkill;
    }
    const levelExp = userWarriorSkill.levelExp - expRequired;
    const checkLevelUp = this.checkLevelUp(userWarriorSkill.level, levelExp);

    userWarriorSkill.coolDown -= 0.1 * userWarriorSkill.coolDown;
    userWarriorSkill.mana -= 0.1 * userWarriorSkill.mana;
    return await this.skillRepository.findByIdAndUpdate(userWarriorSkill._id, {
      level: checkLevelUp.level,
      levelExp: checkLevelUp.levelExp,
      coolDown: userWarriorSkill.coolDown,
      mana: userWarriorSkill.mana,
    });
  }

  checkLevelUp(level: number, levelExp: number) {
    const nextLevel = level + 1;
    if (levelExp <= getLevelExp(nextLevel)) {
      return {
        level: nextLevel,
        levelExp,
      };
    }
    return this.checkLevelUp(nextLevel, levelExp - getLevelExp(nextLevel));
  }

  async getInfoPreUpgradeSkill(
    userId: string,
    userWarriorSkillId: string,
    upgradeResourceDtos: UpgradeResourceDto[],
  ) {
    // ):Promise<UserWarriorSkill> {
    let exp = 0;
    await Promise.all(
      upgradeResourceDtos.map(async (upgradeResource) => {
        const userResource = await this.userResourceRepository.findOne({
          userId,
          'resource.code': upgradeResource.resourceCode,
        });
        exp += userResource.resource.exp * upgradeResource.value;
      }),
    );
    const userWarriorSkill = await this.tryUpdateExp(userWarriorSkillId, exp);
    userWarriorSkill.receivedExp = exp;
    return new UserWarriorSkillReturnDto(userWarriorSkill);
  }

  async tryUpdateExp(uWarriorSkillId: string, exp: number): Promise<UserWarriorSkill> {
    const uSkill = await this.findOneById(uWarriorSkillId);
    console.log('tryUpdateExp', exp, uSkill);
    if (!uSkill) {
      throw new Error('Warrior not found');
    }
    uSkill.levelExp = uSkill.levelExp + exp;
    uSkill.totalExp = uSkill.totalExp + exp;
    const expRequired = getLevelExp(uSkill.level);
    if (expRequired > uSkill.levelExp) {
      return uSkill;
    }
    const levelExp = uSkill.levelExp - expRequired;
    const checkLevelUp = this.checkLevelUp(uSkill.level, levelExp);
    uSkill.coolDown -= 0.1 * uSkill.coolDown;
    uSkill.mana -= 0.1 * uSkill.mana;

    const userWarriorSkill = await this.skillRepository.findOneById(uSkill._id);
    userWarriorSkill.level = checkLevelUp.level;
    userWarriorSkill.levelExp = checkLevelUp.levelExp;
    userWarriorSkill.totalExp = uSkill.totalExp;

    return userWarriorSkill;
  }

  async updateUserWarriorSkill(
    userWarriorSkill: UserWarriorSkill,
  ): Promise<UserWarriorSkill> {
    return this.skillRepository.updateUserWarriorSkill(userWarriorSkill);
  }
  async createUserWarriorSkill(
    userWarriorSkill: UserWarriorSkillDto,
  ): Promise<UserWarriorSkill> {
    return await this.skillRepository.createUserWarriorSkill(userWarriorSkill);
  }
  async findOneById(id: string) {
    return await this.skillRepository.findOneById(id);
  }
}
