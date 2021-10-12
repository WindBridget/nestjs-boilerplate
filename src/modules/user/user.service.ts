import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { roles } from 'common/constant/constants';
import {
  EGoalType,
  EResourceType,
  EUserStatus,
  EUserWarriorStatus,
} from 'common/constant/gameConstants';
import { getLevelExp } from 'common/gameUtil';
import { isEmpty } from 'common/util';
import { UnprocessableException } from 'errorHandlers/unProcessable.exception';
import { SignupDto } from 'modules/auth/dtos/signup.dto';
import { CampaignService } from 'modules/campaign/campaign.service';
import { GoalService } from 'modules/goal/goal.service';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { QuestService } from 'modules/quest/quest.service';
import { ResourceRepository } from 'modules/resource/resource.repository';
import { RewardService } from 'modules/reward/reward.service';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { User } from 'modules/user/schemas/user.schema';
import { UserResourceRepository } from 'modules/userResource/userResource.repository';
import { UserWarrior } from 'modules/userWarrior/schemas/userWarrior.schema';
import { UserWarriorRepository } from 'modules/userWarrior/userWarrior.repository';
import { UserWarriorService } from 'modules/userWarrior/userWarrior.service';
import WAValidator from 'wallet-address-validator';
import { InfoReturnDto } from './dtos/InfoReturn.dto';
import { LeaderboardDto } from './dtos/leaderboard.dto';
import { SlotDto } from './dtos/slot.dto';
import { SlotCreateDto } from './dtos/slotCreate.dto';
import { UserLobbyDto } from './dtos/userLobby.dto';
import { UserReturnDto } from './dtos/userReturn.dto';
import { BetaAccount } from './schemas/betaAccount.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new BackendLogger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userResourceRepository: UserResourceRepository,
    private readonly resourceRepository: ResourceRepository,
    @Inject(forwardRef(() => UserWarriorService))
    private readonly userWarriorService: UserWarriorService,
    private readonly rewardService: RewardService,
    private readonly userWarriorRepository: UserWarriorRepository,
    private readonly goalService: GoalService,
    private readonly campaignService: CampaignService,
    @Inject(forwardRef(() => QuestService))
    private readonly questService: QuestService,
  ) {}

  async findOne(opts: any = {}) {
    return await this.userRepository.findOne(opts);
  }

  async findOneById(id: string) {
    return await this.userRepository.findOneById(id);
  }

  async findAll(opts: any = {}) {
    return await this.userRepository.findAll(opts);
  }

  async getBetaAccounts() {
    return await this.userRepository.getBetaAccounts();
  }

  async getBetaAccountByAdmin(perpage: number, currentPage: number) {
    return await this.userRepository.findAllAndPaginateBetaAccounts(
      perpage,
      currentPage,
    );
  }

  async countBetaAccounts() {
    return await this.userRepository.countBettaAccounts();
  }

  async getAllUserByAdmin(perpage: number, currentPage: number) {
    return await this.userRepository.findAllAndPaginateAllUser(
      perpage,
      currentPage,
    );
  }

  async countUsers() {
    return await this.userRepository.countUsers();
  }

  async getInfo(userId: string): Promise<InfoReturnDto> {
    const user = await this.userRepository.findOneById(userId);
    return new InfoReturnDto(user);
  }

  async create(signupDto: SignupDto): Promise<User> {
    return await this.userRepository.create(signupDto);
  }

  async findByIdAndUpdate(id: string, update: any): Promise<User> {
    return await this.userRepository.findByIdAndUpdate(id, update);
  }

  async findOneAndUpdate(filter: any, update: any): Promise<User> {
    return await this.userRepository.findOneAndUpdate(filter, update);
  }

  async getWalletAddress(userId: string): Promise<string> {
    const user = await this.findOne({ userId });
    return user ? user.walletAddress : '';
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const createdUser = await this.userRepository.create(signupDto);
    await this.createUserInfo(createdUser._id);
    await this.createInitWarriorForUser(createdUser._id);
    await this.createTeam(createdUser._id);
    await this.createInitQuestForUser(createdUser._id);
    return createdUser;
  }

  async createTeam(userId: string): Promise<void> {
    const top: SlotCreateDto = {
      name: 'Top-Warrior',
      code: EUserWarriorStatus.TOP,
      index: 1,
    };
    await this.createTeamSlot(userId, top);

    const main: SlotCreateDto = {
      name: 'Main-Warrior',
      code: EUserWarriorStatus.MAIN,
      index: 2,
    };
    await this.createTeamSlot(userId, main);

    const bottom: SlotCreateDto = {
      name: 'Bottom-Warrior',
      code: EUserWarriorStatus.BOTTOM,
      index: 3,
    };
    await this.createTeamSlot(userId, bottom);
  }

  async createTeamSlot(
    userId: string,
    slotCreateDto: SlotCreateDto,
  ): Promise<User> {
    const slot = await this.userRepository.createSlot(slotCreateDto);
    return await this.userRepository.findByIdAndUpdate(
      userId,
      {
        $push: {
          team: {
            _id: slot._id,
            name: slot.name,
            code: slot.code,
            index: slot.index,
          },
        },
      },
      true,
    );
  }
  async addRole(userId: string, roleName: string) {
    return await this.userRepository.addRole(userId, roleName);
  }

  async disableRole(userId: string, roleName: string) {
    return await this.userRepository.disableRole(userId, roleName);
  }

  async getUserLobby(userId: string): Promise<UserLobbyDto> {
    const user = await this.userRepository.getUserLobby(userId);
    console.log(user);
    return new UserLobbyDto(user);
  }

  async getUserTeam(userId: string): Promise<SlotDto[]> {
    const user = await this.userRepository.getUserLobby(userId);
    if (!user || !user.team) {
      throw Error('Not found user team');
    }
    return user.team.map((slot) => new SlotDto(slot));
  }

  async updateSlot(
    userId: string,
    slotCode: string,
    userWarriorId: string,
  ): Promise<User> {
    const team = await this.checkRemoveSlot(userId, userWarriorId);
    const checkSlot = team.find((slot) => slot.code + '' === slotCode);
    if (checkSlot.userWarriorId) {
      await this.userWarriorService.findByIdAndUpdate(checkSlot.userWarriorId, {
        status: EUserWarriorStatus.OWNED,
      });
    }

    const userWarrior = await this.userWarriorService.findByIdAndUpdate(
      userWarriorId,
      {
        status: slotCode,
      },
    );
    userWarrior.status = slotCode;
    return await this.userRepository.findOneAndUpdate(
      { _id: userId, 'team.code': slotCode },
      {
        $set: {
          'team.$.userWarrior': userWarrior,
        },
      },
    );
  }

  async checkUpdateSlotWhenUpgrade(userId: string, userWarrior: UserWarrior) {
    const team = await this.getUserTeam(userId);
    const checkSlot = team.find(
      (slot) => slot.userWarriorId + '' === userWarrior._id + '',
    );
    console.log(
      'checkUpdateSlotWhenUpgrade',
      team.map((slot) => slot.userWarriorId),
      checkSlot,
      userWarrior._id,
    );
    if (checkSlot) {
      await this.userRepository.findOneAndUpdate(
        { _id: userId, 'team.code': checkSlot.code },
        {
          $set: {
            'team.$.userWarrior': userWarrior,
          },
        },
      );
    }
    return team;
  }

  async checkRemoveSlot(userId: string, userWarriorId: string) {
    const team = await this.getUserTeam(userId);
    const checkRemoveSlot = team.find(
      (slot) => slot.userWarriorId + '' === userWarriorId,
    );
    if (checkRemoveSlot) {
      await this.userRepository.findOneAndUpdate(
        { _id: userId, 'team.code': checkRemoveSlot.code },
        {
          $set: {
            'team.$.userWarrior': null,
          },
        },
      );
    }
    return team;
  }
  async createUserInfo(userId: string) {
    // create role
    await this.addRole(userId, roles.USER);
    // create resource
    await this.createUserResource(userId);
  }

  async createAllMissingUserResources() {
    const users = await this.findAll();
    users.map(async (user) => await this.createUserResource(user._id));
  }

  async createAllMissingTeam() {
    const users = await this.findAll();
    users.map(async (user) => await this.createTeam(user._id));
  }

  async createUserResource(userId: string) {
    // create resource
    const resources = await this.resourceRepository.findAll({
      type: {
        $in: [
          EResourceType.CURRENCY,
          EResourceType.RESOURCE,
          EResourceType.MATERIAL_ITEM,
        ],
      },
    });
    const resourceDtos = [];
    await Promise.all(
      resources.map(async (resource) => {
        const checkUserResource = await this.userResourceRepository.findOne({
          userId,
          'resource.code': resource.code,
        });
        if (!checkUserResource) {
          resourceDtos.push({
            userId,
            resource,
          });
        }
      }),
    );
    // console.log(
    //   'createUserResource',
    //   userId,
    //   resourceDtos.map((dto) => dto.resource.code),
    // );
    await this.userResourceRepository.insertMany(resourceDtos);
  }

  async createInitWarriorForUser(userId: string) {
    await this.userWarriorService.generateDefaultWarriorForUser(userId);
  }

  async createInitQuestForUser(userId: string) {
    await this.questService.createUserQuest(userId);
  }

  async sendReward(
    userId: string,
    rewardId: string,
  ): Promise<RewardResourceItemDto[]> {
    if (isEmpty(rewardId)) {
      return [];
    }
    const listReward = await this.rewardService.getListRewardResource(rewardId);
    listReward.map(async (reward) => {
      await this.userResourceRepository.applyResource(userId, reward);
    });
    return listReward;
  }

  async sendWardForStage(campaignStage: number, rewardId: string) {
    const users = await this.findAll({
      $and: [
        {
          campaignStage: {
            $lte: campaignStage + 9,
          },
        },
        {
          campaignStage: {
            $gte: campaignStage,
          },
        },
      ],
    });
    users.map((user) => this.sendReward(user._id, rewardId));
    return true;
  }

  async applyResourceByCode(
    userId: string,
    code: string,
  ): Promise<RewardResourceItemDto> {
    const reward = await this.rewardService.getRewardResource(code);
    await this.userResourceRepository.applyResource(userId, reward);
    return reward;
  }

  async updateAchievement(userId: string): Promise<UserReturnDto> {
    const userCheck = await this.findOneById(userId);
    if (!userCheck) {
      throw new UnprocessableException('User does not exist!');
    }
    const rewardId = await this.campaignService.getReawardIdByStage(
      userCheck.campaignStage,
    );

    await this.sendReward(userId, rewardId);

    const rewardBonusId = await this.goalService.getRewardByType(
      EGoalType.LEVEL,
      userCheck.campaignStage,
    );
    await this.sendReward(userId, rewardBonusId);

    const update = {
      $inc: {
        campaignStage: 1,
      },
      timeFinishStage: new Date(),
    };
    const user = await this.findByIdAndUpdate(userId, update);
    return new UserReturnDto(user);
  }

  async getLeaderboard(): Promise<LeaderboardDto[]> {
    const users = await this.userRepository.getSummary(50);
    const userList = await Promise.all(
      users.map(async (user, index) => {
        const rewardId = await this.goalService.getRewardByType(
          EGoalType.RANK,
          index + 1,
        );
        const listReward = rewardId
          ? await this.rewardService.getListRewardResource(rewardId)
          : [];
        return new LeaderboardDto({
          rank: index + 1,
          timeFinishStage: user.timeFinishStage
            ? user.timeFinishStage.getTime()
            : 0,
          campaignStage: user.campaignStage,
          name: user.name,
          rewards: listReward,
        });
      }),
    );
    return userList;
  }

  async getLeaderboardByUserId(userId: string): Promise<LeaderboardDto> {
    const users = await this.userRepository.getSummary();
    let pos = 0;
    const user = users.find((element, index) => {
      pos = index + 1;
      return String(element._id) === String(userId);
    });
    const rewardId = await this.goalService.getRewardByType(
      EGoalType.RANK,
      pos,
    );
    const listReward = rewardId
      ? await this.rewardService.getListRewardResource(rewardId)
      : [];

    return new LeaderboardDto({
      rank: pos,
      timeFinishStage: user.timeFinishStage
        ? user.timeFinishStage.getTime()
        : 0,
      campaignStage: user.campaignStage,
      name: user.name,
      rewards: listReward,
    });
  }

  async getSendMonthlyReward(): Promise<UserReturnDto[]> {
    const users = await this.userRepository.getSummary(50);
    const userList = await Promise.all(
      users.map(async (user, index) => {
        const rewardId = await this.goalService.getRewardByType(
          EGoalType.MONTHLY,
          index + 1,
        );
        await this.sendReward(user._id, rewardId);
        return new UserReturnDto(user);
      }),
    );
    console.log(
      'getSendMonthlyReward',
      userList.map((u) => u.name + u.campaignStage),
    );
    return userList;
  }

  async destroyUser(userId: string): Promise<boolean> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw Error('User does not exist!');
    }
    const team = user.team;
    for (const x of team) {
      this.userRepository.deleteSlot(x._id);
    }
    await this.userResourceRepository.deleteMany({ userId });
    await this.userWarriorRepository.deleteMany({ userId });
    await this.userRepository.deleteOne({ _id: userId });
    return true;
  }

  async destroyAllUsers(): Promise<boolean> {
    const users = await this.findAll();
    users.map(async (user) => {
      if (user.email == null) {
        // if (!(user.email === 'admin@gmail.com')) {
        const team = user.team;
        for (const x of team) {
          await this.userRepository.deleteSlot(x._id);
        }
        await this.userResourceRepository.deleteMany({ userId: user._id });
        await this.userWarriorRepository.deleteMany({ userId: user._id });
        await this.userRepository.deleteOne({ _id: user._id });
      }
    });
    return true;
  }

  async checkIncorrectBetaAccount(): Promise<boolean> {
    const betaAccounts = await this.userRepository.getBetaAccounts();
    const listIncorrect = betaAccounts.filter(
      (betaAccount) =>
        !WAValidator.validate(betaAccount.walletAddress, 'ETH', 'BSC'),
    );
    console.log(
      'checkIncorrectBetaAccount',
      listIncorrect.map((betaAccount) => betaAccount._id),
    );
    await this.userRepository.removeIncorrectBetaAccounts(
      listIncorrect.map((betaAccount) => betaAccount._id),
    );
    return true;
  }

  async getBetaAccountByWallet(walletAddress: string): Promise<BetaAccount> {
    return await this.userRepository.getBetaAccountByWallet(walletAddress);
  }

  async addExpToUser(userId: string, expAmount: number): Promise<User> {
    try {
      const exp = expAmount;
      const user = await this.runAddExp(userId, exp);
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async runAddExp(userId: string, exp: number): Promise<User> {
    const user = await this.addExp(userId, exp);
    console.log('runAddExp', exp, user);
    return await this.levelUp(user);
  }

  async addExp(userId: string, exp: number): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new Error(' not found');
    }
    return await this.userRepository.findByIdAndUpdate(userId, {
      $inc: {
        levelExp: exp,
        totalExp: exp,
      },
    });
  }

  async levelUp(user: User): Promise<User> {
    const expRequired = getLevelExp(user.level);

    if (expRequired > user.levelExp) {
      this.logger.error(
        `not enough exp ${user.levelExp}/${expRequired}.`,
        'levelUp',
      );
      return user;
    }

    const levelExp = user.levelExp - expRequired;
    const checkLevelUp = this.checkLevelUp(user.level, levelExp);
    return await this.userRepository.findByIdAndUpdate(user._id, {
      level: checkLevelUp.level,
      levelExp: checkLevelUp.levelExp,
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

  async switchAvatar(
    userId: string,
    avatarCode: string,
  ): Promise<UserReturnDto> {
    const user = await this.userRepository.findByIdAndUpdate(userId, {
      avatarCode,
    });
    return new UserReturnDto(user);
  }
  async getAvatarByUserId(userId: string): Promise<string[]> {
    return await this.userWarriorService.getAvatarByUserId(userId);
  }

  async resetDailyRewardStage(): Promise<any> {
    return await this.userRepository.resetDailyRewardStage();
  }

  async setDailyRewardStage(): Promise<any> {
    return await this.userRepository.setDailyRewardStage();
  }

  async resetDailyLoginReward(): Promise<any> {
    return await this.userRepository.resetDailyLoginReward();
  }

  async updateUserName(userId: string, name: string) {
    if (isEmpty(name)) {
      throw new UnprocessableException('Do not leave blank for your name!');
    }

    if (name.length > 10) {
      throw new UnprocessableException('Your name is over 10 characters!');
    }

    const userCheck = await this.findOne({
      name,
    });
    if (userCheck) {
      throw new UnprocessableException('Someone has used this name!');
    }
    const update = {
      name,
      status: EUserStatus.ACTIVE,
    };
    return this.findByIdAndUpdate(userId, update);
  }

  async energyRecover(energyRegen: number, maxEnergy: number): Promise<any> {
    return await this.userRepository.energyRecover(energyRegen, maxEnergy);
  }

  async energyUsage(usedId: string, energyUsed: number): Promise<any> {
    const user = await this.findOneById(usedId);
    const currentEnergy = user.energy;
    if (currentEnergy >= energyUsed) {
      await this.userRepository.energyUsage(usedId, energyUsed);
      return true;
    }
    return false;
  }
}
