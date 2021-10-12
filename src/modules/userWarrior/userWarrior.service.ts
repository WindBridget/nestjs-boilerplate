
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  EResourceCode,
  EUserWarriorStatus,
  EWarriorAtkSpdBeta,
  EWarriorDmgBeta,
  EWarriorRarity,
  EWarriorStatus,
  WARRIOR_ATKSPD_PROGRESS_ALPHA,
  WARRIOR_DEFAULT_PRICE,
  WARRIOR_DMG_PROGRESS_ALPHA,
  WARRIOR_LIMIT,
} from 'common/constant/gameConstants';
import {
  generateBaseStats,
  getLevelExp,
  getStatsProgression,
} from 'common/gameUtil';
import { isEmpty, randomInt } from 'common/util';
import * as util from 'ethereumjs-util';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { OrderRepository } from 'modules/order/order.repository';
import { SkillService } from 'modules/skill/skill.service';
import { UserService } from 'modules/user/user.service';
import { UserResourceRepository } from 'modules/userResource/userResource.repository';
import { UpgradeResourceDto } from 'modules/userWarrior/dtos/upgradeResource.dto';
import { UserWarrior } from 'modules/userWarrior/schemas/userWarrior.schema';
import { Warrior } from 'modules/warrior/schemas/warrior.schema';
import { WarriorRepository } from 'modules/warrior/warrior.repository';
import Web3 from 'web3';
import { BuyItemDto } from './dtos/buy-item.dto';
import { CreateItemDto } from './dtos/create-item.dto';
import { MintItemDto } from './dtos/mint-item.dto';
import { UserListWarriorDto } from './dtos/userListWarrior.dto';
import { UserWarriorCreateDto } from './dtos/userWarriorCreate.dto';
import { UserWarriorItemDto } from './dtos/userWarriorItem.dto';
import { UserWebListWarriorDto } from './dtos/userWebListWarrior.dto';
import { UserWarriorRepository } from './userWarrior.repository';
import { Order } from '../order/schemas/order.schema';
import { OrderDto } from '../order/dtos/order.dto';
import { UserWarriorOrderDto } from './dtos/userWarriorOrder.dto';
import { UserWebListWarriorOrderDto } from './dtos/userWebListWarriorOrder.dto';

@Injectable()
export class UserWarriorService {
  private readonly logger = new BackendLogger(UserWarriorService.name);

  constructor(
    private readonly userWarriorRepository: UserWarriorRepository,
    private readonly warriorRepository: WarriorRepository,
    private readonly userResourceRepository: UserResourceRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SkillService))
    private readonly skillService: SkillService,
    @Inject(forwardRef(() => OrderRepository))
    private readonly orderRepository: OrderRepository,
  ) { }

  async findOne(opts: any = {}) {
    return await this.userWarriorRepository.findOne(opts);
  }

  async findOneById(id: string) {
    return await this.userWarriorRepository.findOneById(id);
  }

  async findByIdAndUpdate(id: string, update: any = {}) {
    return await this.userWarriorRepository.findByIdAndUpdate(id, update);
  }

  async findAll(opts: any = {}) {
    return await this.userWarriorRepository.findAll(opts);
  }

  async findByUserId(userId) {
    return await this.userWarriorRepository.findByUserId(userId);
  }

  async generateDefaultWarriorForUser(userId: string): Promise<UserWarrior[]> {
    const warriors = await this.warriorRepository.findDefault();
    warriors.splice(3);
    console.log(warriors.length, 'LENGTH');
    const walletAddress = await this.userService.getWalletAddress(userId);
    return await Promise.all(
      warriors.map(
        async (warrior) =>
          await this.createrWarrior(warrior, true, userId, walletAddress),
      ),
    );
  }

  async generateWarriorForUserTest(
    userId: string,
    quantity: number,
  ): Promise<UserWarrior[]> {
    const warriors = await this.warriorRepository.findRandom(
      quantity,
      EWarriorRarity.Common,
      EWarriorStatus.Test,
    );
    const walletAddress = await this.userService.getWalletAddress(userId);
    return await Promise.all(
      warriors.map(
        async (warrior) =>
          await this.createrWarrior(warrior, true, userId, walletAddress),
      ),
    );
  }

  async generateWarrior(
    quantity: number,
    rarity: string,
  ): Promise<UserWarrior[]> {
    const warriors = await this.warriorRepository.findRandom(quantity, rarity);
    return await Promise.all(
      warriors.map(
        async (warrior) =>
          await this.createrWarrior(warrior, false, null, null),
      ),
    );
  }

  async createrWarrior(
    warrior: Warrior,
    isInit: boolean,
    userId: string,
    walletAddress: string,
    status: EUserWarriorStatus = EUserWarriorStatus.SYSTEM,
  ): Promise<UserWarrior> {
    try {
      const stats = generateBaseStats(warrior.type);
      const token = +(new Date().getTime() + '' + randomInt(2));
      const data: UserWarriorCreateDto = {
        userId,
        walletAddress,
        warrior,
        level: 1,
        levelExp: 0,
        totalExp: 0,
        damage: stats.damage,
        attackSpeed: stats.attackSpeed,
        price: isInit ? 0 : WARRIOR_DEFAULT_PRICE,
        isLocked: isInit,
        status,
        creatationTime: new Date(),
        nftToken: token,
        mintTransactionHash: null,
        sellOrder: null,
        signature: null,
        isPutOnMarket: !isInit,
        royalties: 1000,
        totalQuantity: 1,
      };

      const userWarrior = await this.userWarriorRepository.create(data);
      const skill = await this.skillService.getRandomSkill(
        warrior.type,
        warrior.element,
      );
      const userWarriorSkill = await this.skillService.generateUserWarriorSkill(userWarrior._id, skill, warrior.rarity);
      userWarrior.skill = userWarriorSkill;
      return await this.userWarriorRepository.update(userWarrior);
    } catch (e) {
      console.log('createrWarrior errr: ', e);
    }
  }

  async sellAll(userId: string) {
    const userWarriors = await this.findAll({
      userId,
      isPutOnMarket: true,
    });
    const data = await Promise.all(
      userWarriors.map(async (userWarrior) => {
        return await this.requestMintSignature(
          userWarrior.nftToken,
          WARRIOR_DEFAULT_PRICE,
        );
      }),
    );
    return data;
  }

  async requestMintSignature(
    nftToken: number,
    price: number,
  ): Promise<MintItemDto> {
    const userWarrior = await this.userWarriorRepository.findOne({
      nftToken,
      isLocked: false,
    });
    if (!userWarrior) {
      throw new Error(`Item doesn't exists`);
    }

    if (userWarrior.mintTransactionHash) {
      return {
        isMinted: userWarrior.mintTransactionHash != null,
        nftToken,
      } as MintItemDto;
    }
    await this.userWarriorRepository.findOneAndUpdate(
      {
        nftToken,
        isLocked: false,
      },
      {
        price,
      },
    );

    const web3 = new Web3();

    const hash = web3.utils.soliditySha3(process.env.TOKEN_ADDRESS, nftToken);
    const privateKey = Buffer.from(process.env.SIGNER_PRIVATE_KEY, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const v = signature.v;
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);
    const data = {
      isMinted: userWarrior.mintTransactionHash != null,
      nftToken,
      v,
      r,
      s,
    } as MintItemDto;

    return data;
  }

  async requestBuyAsset(nftToken: number, userId: string): Promise<BuyItemDto> {
    const countWarrior = await this.userWarriorRepository.count({
      userId,
      isLocked: false,
    });
    if (countWarrior > WARRIOR_LIMIT) {
      throw new Error(`Cannot buy more warriors than the allowed quantity of ${WARRIOR_LIMIT}`);
    }
    const userWarrior = await this.userWarriorRepository.findOne({
      nftToken,
      isLocked: false,
    });

    if (!userWarrior) {
      throw new Error(`Item doesn't exists`);
    }

    if (userWarrior.sellOrder === undefined || userWarrior.sellOrder === null) {
      throw new Error(`Item doesn't on Sale`);
    }

    const web3 = new Web3();

    const buyerFee = 0;

    const buyerFeeHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          {
            Order: {
              key: {
                owner: 'address',
                salt: 'uint256',
                sellAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
                buyAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
              },
              selling: 'uint256',
              buying: 'uint256',
              sellerFee: 'uint256',
            },
          },
          'uint256',
        ],
        [JSON.parse(userWarrior.sellOrder), buyerFee],
      ),
    );

    const buyerFeeSignature = web3.eth.accounts.sign(
      buyerFeeHash.slice(2),
      process.env.SIGNER_PRIVATE_KEY,
    );

    return {
      nftToken,
      buyQuantities: userWarrior.totalQuantity,
      buyerFee,
      buyerFeeSignature: buyerFeeSignature.signature,
      sellOrder: userWarrior.sellOrder,
      signature: userWarrior.signature,
    } as BuyItemDto;
  }

  async updateNftCreate(
    nftToken: number,
    createItemDtos: CreateItemDto,
  ): Promise<UserWarriorItemDto> {
    const userWarrior = await this.userWarriorRepository.findOne({
      nftToken,
      isLocked: false,
    });

    if (!userWarrior) {
      throw new Error(`Item doesn't exists`);
    }

    const data = await this.userWarriorRepository.findOneAndUpdate(
      {
        nftToken,
        isLocked: false,
      },
      {
        status: EUserWarriorStatus.IN_MARKET,
        price: createItemDtos.price,
        sellOrder: createItemDtos.sellOrder,
        mintTransactionHash: createItemDtos.mintTransactionHash,
        signature: createItemDtos.signature,
      },
    );
    if (userWarrior.userId) {
      await this.userService.checkRemoveSlot(
        userWarrior.userId,
        userWarrior._id,
      );
    }

    return new UserWarriorItemDto(data);
  }

  async updateNftOwner(
    nftToken: number,
    userId: string,
    walletAddress: string,
  ): Promise<UserWarriorItemDto> {
    const userWarrior = await this.userWarriorRepository.findOne({
      nftToken,
      isLocked: false,
    });

    if (!userWarrior) {
      throw new Error(`Item doesn't exists`);
    }

    const data = await this.userWarriorRepository.findOneAndUpdate(
      {
        nftToken,
        isLocked: false,
      },
      {
        userId,
        walletAddress: walletAddress.toLowerCase(),
        sellOrder: null,
        signature: null,
        status: EUserWarriorStatus.OWNED,
      },
    );
    return new UserWarriorItemDto(data);
  }

  async runAddExp(warriorId: string, exp: number): Promise<UserWarrior> {
    const warrior = await this.addExp(warriorId, exp);
    console.log('runAddExp', exp, warrior);
    return await this.levelUp(warrior);
  }

  async tryUpdateExp(warriorId: string, exp: number): Promise<UserWarrior> {
    const warrior = await this.findOneById(warriorId);
    console.log('tryUpdateExp', exp, warrior);
    if (!warrior) {
      throw new Error('Warrior not found');
    }
    warrior.levelExp = warrior.levelExp + exp;
    warrior.totalExp = warrior.totalExp + exp;
    const expRequired = getLevelExp(warrior.level);
    if (expRequired > warrior.levelExp) {
      return warrior;
    }
    const levelExp = warrior.levelExp - expRequired;
    const checkLevelUp = this.checkLevelUp(warrior.level, levelExp);
    const damage = getStatsProgression(
      WARRIOR_DMG_PROGRESS_ALPHA,
      EWarriorDmgBeta[warrior.warrior.type],
      checkLevelUp.level,
    );
    const attackSpeed = getStatsProgression(
      WARRIOR_ATKSPD_PROGRESS_ALPHA,
      EWarriorAtkSpdBeta[warrior.warrior.type],
      checkLevelUp.level,
    );
    const userWarrior = await this.userWarriorRepository.findOneById(warrior._id);
    userWarrior.level = checkLevelUp.level;
    userWarrior.levelExp = checkLevelUp.levelExp;
    userWarrior.damage = damage;
    userWarrior.attackSpeed = attackSpeed;
    userWarrior.totalExp = warrior.totalExp;

    return userWarrior;
  }

  async addExp(userWarriorId: string, exp: number): Promise<UserWarrior> {
    const warrior = await this.findOneById(userWarriorId);
    if (!warrior) {
      throw new Error('Warrior not found');
    }
    return await this.userWarriorRepository.findByIdAndUpdate(warrior._id, {
      $inc: {
        levelExp: exp,
        totalExp: exp,
      },
    });
  }

  async levelUp(uWarrior: UserWarrior): Promise<UserWarrior> {
    const expRequired = getLevelExp(uWarrior.level);

    if (expRequired > uWarrior.levelExp) {
      this.logger.error(
        `not enough exp ${uWarrior.levelExp}/${expRequired}.`,
        'levelUp',
      );
      return uWarrior;
    }

    const levelExp = uWarrior.levelExp - expRequired;
    const checkLevelUp = this.checkLevelUp(uWarrior.level, levelExp);
    const damage = getStatsProgression(
      WARRIOR_DMG_PROGRESS_ALPHA,
      EWarriorDmgBeta[uWarrior.warrior.type],
      checkLevelUp.level,
    );
    const attackSpeed = getStatsProgression(
      WARRIOR_ATKSPD_PROGRESS_ALPHA,
      EWarriorAtkSpdBeta[uWarrior.warrior.type],
      checkLevelUp.level,
    );
    return await this.userWarriorRepository.findByIdAndUpdate(uWarrior._id, {
      level: checkLevelUp.level,
      levelExp: checkLevelUp.levelExp,
      damage,
      attackSpeed,
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

  async getListUserWarriors(
    userId: string,
    sortBy: string,
    // page: number = DEFAULT_PAGE,
    // limit: number = DEFAULT_LIMIT,
  ): Promise<UserListWarriorDto> {
    const userWarriors = await this.userWarriorRepository.getListUserWarriors(
      userId,
      sortBy,
      // page,
      // limit,
    );
    const warriors = await Promise.all(
      userWarriors.map(
        async (userWarrior: UserWarrior) => new UserWarriorItemDto(userWarrior),
      ),
    );

    const firstWarriorId = userWarriors.length
      ? userWarriors.map((userWarrior) => userWarrior._id).shift()
      : '';
    const firstWarrior = firstWarriorId
      ? await this.getWarriorDetail(firstWarriorId)
      : new UserWarriorItemDto();

    // const total = await this.userWarriorRepository.count({ userId });
    // const totalPages = getTotalPages(limit, total);
    const data = {
      warriors,
      firstPlayer: firstWarrior,
      // totalPages,
    };
    return new UserListWarriorDto(data);
  }

  async getWarriorsForWeb(
    sortBy: string,
    orderBy: string,
    page: number,
    limit: number,
    type: string[] = [],
    element: string[] = [],
    rarity: string[] = [],
    role: string[] = [],
    userId?: string,
  ): Promise<UserWebListWarriorDto> {
    const filter = userId
      ? {
        userId,
        status: {
          $nin: [EUserWarriorStatus.IN_MARKET, EUserWarriorStatus.SYSTEM],
        },
      }
      : {
        status: {
          $in: [EUserWarriorStatus.IN_MARKET, EUserWarriorStatus.SYSTEM],
        },
      };
    if (!isEmpty(type)) {
      Object.assign(filter, {
        'warrior.type': {
          $in: type,
        },
      });
    }
    if (!isEmpty(element)) {
      Object.assign(filter, {
        'warrior.element': {
          $in: element,
        },
      });
    }
    if (!isEmpty(rarity)) {
      Object.assign(filter, {
        'warrior.rarity': {
          $in: rarity,
        },
      });
    }
    if (!isEmpty(role)) {
      Object.assign(filter, {
        'warrior.role': {
          $in: role,
        },
      });
    }
    const userWarriors = await this.userWarriorRepository.findAllForWeb(
      sortBy,
      orderBy,
      page,
      limit,
      filter,
    );
    const total = await this.userWarriorRepository.count(filter);
    const totalPage = Math.ceil(total / limit);
    const warriors = userWarriors.map(
      (userWarrior: UserWarrior) => new UserWarriorItemDto(userWarrior),
    );

    return new UserWebListWarriorDto({
      warriors,
      page,
      limit,
      totalPage,
      total,
    });
  }

  async getWarriorsOrders(
    sortBy: string,
    orderBy: string,
    page: number,
    limit: number,
    type: string[] = [],
    element: string[] = [],
    rarity: string[] = [],
    role: string[] = [],
    userId?: string,
  ): Promise<UserWebListWarriorOrderDto> {
    const orders = await this.orderRepository.findAll();
    const nftIds = orders.map((order) => order.nftId);
    const filter = {
      nftId: {
        $in: nftIds,
      },
    };
    if (!isEmpty(type)) {
      Object.assign(filter, {
        'warrior.type': {
          $in: type,
        },
      });
    }
    if (!isEmpty(element)) {
      Object.assign(filter, {
        'warrior.element': {
          $in: element,
        },
      });
    }
    if (!isEmpty(rarity)) {
      Object.assign(filter, {
        'warrior.rarity': {
          $in: rarity,
        },
      });
    }
    if (!isEmpty(role)) {
      Object.assign(filter, {
        'warrior.role': {
          $in: role,
        },
      });
    }
    const userWarriors = await this.userWarriorRepository.findAllForWeb(
      sortBy,
      orderBy,
      page,
      limit,
      filter,
    );
    const total = await this.userWarriorRepository.count(filter);
    const totalPage = Math.ceil(total / limit);
    const warriors = userWarriors.map(
      (userWarrior: UserWarrior) => {
        const warrior = new UserWarriorOrderDto(userWarrior);
        const order = orders.find((_order) => _order.nftId === warrior.nftId);
        warrior.order = new OrderDto(order);
        console.log(warrior);
        return warrior;
      },
    );
    return new UserWebListWarriorOrderDto({
      warriors,
      page,
      limit,
      totalPage,
      total,
    });
  }

  async getWarriorDetail(userWarriorId: string): Promise<UserWarriorItemDto> {
    const userWarrior = await this.userWarriorRepository.findOneById(
      userWarriorId,
    );
    return new UserWarriorItemDto(userWarrior);
  }

  async upgradeWarrior(
    userId: string,
    userWarriorId: string,
    totalCoin: number,
    upgradeResourceDtos: UpgradeResourceDto[],
  ): Promise<UserWarriorItemDto> {
    try {
      let exp = 0;
      await Promise.all(
        upgradeResourceDtos.map(async (upgradeResource) => {
          const userResource =
            await this.userResourceRepository.applyResourceByCodeAndValue(
              userId,
              upgradeResource.resourceCode,
              -upgradeResource.value,
            );
          exp += userResource.resource.exp * upgradeResource.value;
        }),
      );
      await this.userResourceRepository.applyResourceByCodeAndValue(
        userId,
        EResourceCode.COIN,
        -totalCoin,
      );
      const userWarrior = await this.runAddExp(userWarriorId, exp);
      await this.userService.checkUpdateSlotWhenUpgrade(userId, userWarrior);
      return new UserWarriorItemDto(userWarrior);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getInfoPreUpgradeWarrior(
    userId: string,
    userWarriorId: string,
    upgradeResourceDtos: UpgradeResourceDto[],
  ): Promise<UserWarriorItemDto> {
    try {
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
      const userWarrior = await this.tryUpdateExp(userWarriorId, exp);
      userWarrior.receivedExp = exp;
      return new UserWarriorItemDto(userWarrior);
    } catch (e) {
      throw new Error(e);
    }
  }

  async checkUpdateSlot(userId: string, userWarriorId: string, status: string) {
    switch (status) {
      case EUserWarriorStatus.TOP:
        await this.userService.updateSlot(
          userId,
          EUserWarriorStatus.TOP,
          userWarriorId,
        );
      case EUserWarriorStatus.MAIN:
        await this.userService.updateSlot(
          userId,
          EUserWarriorStatus.MAIN,
          userWarriorId,
        );
      case EUserWarriorStatus.BOTTOM:
        await this.userService.updateSlot(
          userId,
          EUserWarriorStatus.BOTTOM,
          userWarriorId,
        );
      default:
        return;
    }
  }
  async resetHealth() {
    await this.userWarriorRepository.resetHealth();
    return true;
  }

  async getAvatarByUserId(userId: string): Promise<string[]> {
    const userWarriors = await this.userWarriorRepository.findByUserId(userId);
    return userWarriors.map(userWarrior => userWarrior.warrior.head);
  }

  // async xxx(): Promise<boolean> {
  //   let count = 1;
  //   const userWarriors = await this.userWarriorRepository.findAll();
  //   for (const warrior of userWarriors) {
  //     warrior.nftId = count;
  //     count += 1;
  //     console.log(count);
  //     await warrior.save();
  //   }
  //   return true;
  // }
}
