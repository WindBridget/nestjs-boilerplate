import { Injectable } from '@nestjs/common';
import { EUserStatus } from 'common/constant/gameConstants';
import { BaseRepository } from 'common/repository/base.repository';
import { SignupDto } from 'modules/auth/dtos/signup.dto';
import { Role } from 'modules/user/schemas/role.schema';
import { User } from 'modules/user/schemas/user.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { SlotCreateDto } from './dtos/slotCreate.dto';
import { BetaAccount } from './schemas/betaAccount.schema';
import { Slot } from './schemas/slot.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User) private readonly userModel: ModelType<User>,
    @InjectModel(Role) private readonly roleModel: ModelType<Role>,
    @InjectModel(Slot) private readonly slotModel: ModelType<Slot>,
    @InjectModel(BetaAccount)
    private readonly betaAccountModel: ModelType<BetaAccount>,
  ) {
    super(userModel);
  }

  async findAllId(): Promise<string[]> {
    const users = await this.userModel.find().select({ _id: 1 });
    return users.map((user) => user._id);
  }

  async findOne(opts: any = {}) {
    return await this.userModel.findOne(opts);
  }

  async create(createUserDto: SignupDto): Promise<User> {
    this.logger.log(
      `Creating new user: ${createUserDto.walletAddress.toLowerCase()}`,
    );
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async createSlot(createSlotDto: SlotCreateDto): Promise<Slot> {
    const newSlot = new this.slotModel(createSlotDto);
    return await newSlot.save();
  }

  async getUserLobby(userId: string): Promise<User> {
    return (await this.findOneById(userId)).populate({
      path: 'team',
      populate: {
        path: 'userWarrior',
      },
    });
  }

  async addRole(userId: string, roleName: string) {
    const user = await this.findOneById(userId);

    // Only add the role if the user doesn't already have it
    const existingRole =
      user.roles && user.roles.find((role) => role.name === roleName);
    if (existingRole) {
      // If they have the role already, make sure its enabled here
      this.logger.log(`User: ${user.email} already has role: ${roleName}`);
      existingRole.enabled = true;
      user.markModified('roles');
      return await user.save();
    }

    user.roles.push(new this.roleModel({ name: roleName, enabled: true }));
    user.markModified('roles');
    return await user.save();
  }

  async disableRole(userId: string, roleName: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId, 'roles.name': roleName },
      {
        $set: {
          'roles.$.enabled': false,
        },
      },
      // Return the doc after the update
      { new: true },
    );
  }

  async getSummary(limit?: number) {
    if (limit) {
      return await this.userModel
        .find({
          status: EUserStatus.ACTIVE,
        })
        .sort([
          ['campaignStage', -1],
          ['timeFinishStage', 1],
        ])
        .limit(limit);
    } else {
      return await this.userModel
        .find({
          status: EUserStatus.ACTIVE,
        })
        .sort([
          ['campaignStage', -1],
          ['timeFinishStage', 1],
        ]);
    }
  }

  async deleteSlot(slotId: string) {
    await this.slotModel.deleteOne({ _id: slotId });
  }

  async getBetaAccounts(): Promise<BetaAccount[]> {
    return await this.betaAccountModel.find();
  }

  async findAllAndPaginateBetaAccounts(
    perpage,
    currentpage,
  ): Promise<BetaAccount[]> {
    return await this.betaAccountModel
      .find()
      .limit(perpage)
      .skip(perpage * currentpage);
  }

  async countBettaAccounts(): Promise<number> {
    return await this.betaAccountModel.estimatedDocumentCount();
  }

  async findAllAndPaginateAllUser(perpage, currentpage): Promise<User[]> {
    return await this.userModel
      .find()
      .limit(perpage)
      .skip(perpage * currentpage);
  }

  async countUsers(): Promise<number> {
    return await this.userModel.estimatedDocumentCount();
  }

  async getBetaAccountByWallet(walletAddress: string): Promise<BetaAccount> {
    return await this.betaAccountModel.findOne({ walletAddress });
  }

  async removeIncorrectBetaAccounts(betaAccountIds: string[]): Promise<void> {
    await this.betaAccountModel.deleteMany({
      _id: {
        $in: betaAccountIds,
      },
    });
  }

  async setDailyRewardStage() {
    return await this.userModel.updateMany(
      {
        $and: [{ dailyRewardStage: { $lte: 7 } }, { haveDailyReward: true }],
      },
      {
        $inc: { dailyRewardStage: 1 },
      },
    );
  }

  async resetDailyRewardStage() {
    return await this.userModel.updateMany(
      {
        $or: [{ dailyRewardStage: { $gt: 7 } }, { haveDailyReward: false }],
      },
      {
        $set: {
          dailyRewardStage: 1,
        },
      },
    );
  }

  async resetDailyLoginReward() {
    return await this.userModel.updateMany(
      {},
      {
        $set: {
          haveDailyReward: false,
        },
      },
    );
  }

  async energyRecover(energyRegen: number, maxEnergy: number) {
    return await this.userModel.updateMany(
      {
        energy: {
          $lt: maxEnergy,
        },
      },
      {
        $inc: {
          energy: energyRegen,
        },
      },
    );
  }

  async energyUsage(userId: string, energyUsed: number) {
    return await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $inc: {
          energy: -energyUsed,
        },
      },
    );
  }
}
