import { Injectable } from '@nestjs/common';
import {
  EWarriorConfigType,
  EWarriorRarity,
  EWarriorSize,
  EWarriorStatus,
  LIST_ELEMENT,
  LIST_RARITY,
  LIST_ROLE,
  LIST_TYPE,
  LIST_TYPE_FAT,
  LIST_TYPE_THIN,
  SKILL,
} from 'common/constant/gameConstants';
import { getCodeByType, getRandom, warriorName } from 'common/gameUtil';
import { randomStr } from 'common/util';
import { GameConfigRepository } from 'modules/gameConfig/gameConfig.repository';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { WarriorCreateDto } from './dtos/warriorCreate.dto';
import { WarriorUserCreateDto } from './dtos/warriorUserCreate.dto';
import { Warrior } from './schemas/warrior.schema';
import { WarriorRepository } from './warrior.repository';

@Injectable()
export class WarriorService {
  private readonly logger = new BackendLogger(WarriorService.name);

  constructor(
    private readonly warriorRepository: WarriorRepository,
    private readonly gameConfigRepository: GameConfigRepository,
  ) { }

  async findOneById(id: string) {
    return await this.warriorRepository.findOneById(id);
  }

  async findAll() {
    return await this.warriorRepository.findAll();
  }

  async getWarriors(perpage: number, currentPage: number) {
    return await this.warriorRepository.findAllAndPaginateWarrior(perpage, currentPage);
  }

  async countWarriors() {
    return await this.warriorRepository.countWarrior();
  }

  async getWarriorConfigByKey(key: string): Promise<string[]> {
    return await this.gameConfigRepository.getWarriorConfigByKey(key);
  }

  async getWeeklyWarriors(): Promise<Warrior[]> {
    return await this.warriorRepository.getWeeklyWarriors();
  }

  async randomWarrior(
    initRarity: string,
    initRole: string,
    initType: string,
  ): Promise<WarriorCreateDto> {
    // const listType = await this.getWarriorConfigByKey(
    //   EWarriorConfigType.WARRIOR_TYPE,
    // );
    // const listElement = await this.getWarriorConfigByKey(
    //   EWarriorConfigType.WARRIOR_ELEMENT,
    // );
    // const listRarity = await this.getWarriorConfigByKey(
    //   EWarriorConfigType.WARRIOR_RARITY,
    // );
    // const listRole = await this.getWarriorConfigByKey(
    //   EWarriorConfigType.WARRIOR_ROLE,
    // );

    const skill = getRandom(SKILL);
    const rarity = initRarity ? initRarity : getRandom(LIST_RARITY);
    let rareOrder;
    switch (rarity) {
      case EWarriorRarity.Common: rareOrder = 4;
      case EWarriorRarity.Rare: rareOrder = 3;
      case EWarriorRarity.Epic: rareOrder = 2;
      case EWarriorRarity.Legend: rareOrder = 1;
    }
    const role = initRole ? initRole : getRandom(LIST_ROLE);
    const element = getRandom(LIST_ELEMENT);
    const type = getRandom(LIST_TYPE);
    // const hand = getTypeBySize(initSize);
    // const body = getTypeBySize(initSize);
    // const leg = getTypeBySize(initSize);
    const headCode = getCodeByType(type);
    const handCode = getCodeByType(type);
    const bodyCode = getCodeByType(type);
    const legCode = getCodeByType(type);
    const name = warriorName(role, type);
    const warriorDto: WarriorCreateDto = {
      name,
      head: headCode,
      sholder: handCode,
      leftHand: handCode,
      rightHand: handCode,
      body: bodyCode,
      leg: legCode,
      leftWeapon: role,
      rightWeapon: getRandom(LIST_ROLE),
      type,
      element,
      rarity,
      rareOrder,
      role,
      skill,
      status: EWarriorStatus.Test,
      releaseDate: new Date(),
      spineJson: '',
      spineImage: '',
      spineAtlas: '',
    };
    return warriorDto;
  }

  async createRandomWarrior(
    quantity: number,
    initRarity: string,
    initRole: string,
    initType: string,
  ): Promise<Warrior[]> {
    const listWarrior: WarriorCreateDto[] = [];
    for (let i = 0; i < quantity; i++) {
      const warrior = await this.randomWarrior(initRarity, initRole, initType);
      listWarrior.push(warrior);
    }
    return await this.warriorRepository.insertMany(listWarrior);
  }

  createWarrior(userWarrior: WarriorUserCreateDto): Promise<Warrior> {
    const role = getRandom(LIST_ROLE);
    const type = getRandom(LIST_TYPE);
    const name = warriorName(role, type);

    const warriorDto: WarriorCreateDto = {
      name,
      role,
      type,
      body: userWarrior.body,
      element: getRandom(LIST_ELEMENT),
      head: userWarrior.head,
      leftHand: userWarrior.leftHand,
      leftWeapon: '',
      leg: userWarrior.leg,
      rarity: getRandom(LIST_RARITY),
      rightHand: userWarrior.rightHand,
      rightWeapon: '',
      sholder: userWarrior.shoulder,
      skill: '',
      spineAtlas: userWarrior.spineAtlas,
      spineImage: userWarrior.spineImage,
      spineJson: userWarrior.spineJson,
      status: EWarriorStatus.Draft,
      releaseDate: new Date(),
    };
    return this.warriorRepository.create(warriorDto);
  }
}
