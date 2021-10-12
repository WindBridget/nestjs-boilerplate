import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulerRegistry } from '@nestjs/schedule';
import { roles } from 'common/constant/constants';
import { ECampaignEnergyCost } from 'common/constant/gameConstants';
import { VoidScalar } from 'common/scalars/void.scalar';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { LoginRecordService } from 'modules/loginRecord/loginRecord.service';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { BetaAccount } from 'modules/user/schemas/betaAccount.schema';
import { User } from 'modules/user/schemas/user.schema';
import { UserResourceService } from 'modules/userResource/userResource.service';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { LeaderboardDto } from './dtos/leaderboard.dto';
import { SlotDto } from './dtos/slot.dto';
import { UserLobbyDto } from './dtos/userLobby.dto';
import { UserReturnDto } from './dtos/userReturn.dto';
import { UserService } from './user.service';
// import { NotificationStatusService } from 'src/notificationStatus/notificationStatus.service';

@Resolver(User)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserResolver {
  private readonly logger = new BackendLogger(UserResolver.name);
  private pubSub = new PubSub();
  // private readonly notificationStatusService: NotificationStatusService,
  constructor(
    private readonly userService: UserService,
    private readonly loginRecordService: LoginRecordService,
    private readonly userResourceService: UserResourceService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Query(() => [User])
  getAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => [User])
  @Roles(roles.ADMIN)
  getAllUsersByAdmin(
    @Args('perpage') perpage: number,
    @Args('currentpage') currentpage: number,
  ) {
    return this.userService.getAllUserByAdmin(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countUsers() {
    return this.userService.countUsers();
  }

  @Query(() => [BetaAccount])
  @Roles(roles.ADMIN)
  getBetaAccountByAdmin(
    @Args('perpage') perpage: number,
    @Args('currentpage') currentpage: number,
  ) {
    return this.userService.getBetaAccountByAdmin(perpage, currentpage);
  }

  @Query(() => [BetaAccount])
  @Roles(roles.ADMIN)
  getBetaAccounts() {
    return this.userService.getBetaAccounts();
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countBetaAccounts() {
    return this.userService.countBetaAccounts();
  }

  @Query(() => User)
  async getUser(@CurrentUser() user: User) {
    // this.pubSub.publish('gotUser', { gotUser: 'Hiep is coming...' });
    // const job = this.schedulerRegistry.getCronJob('testCron');
    // job.start();
    return this.userService.findOneById(user._id);
  }

  // @Subscription(() => String)
  // gotUser() {
  //   return this.pubSub.asyncIterator('gotUser');
  // }

  @Query(() => UserLobbyDto)
  getUserLobby(@CurrentUser() user: User) {
    return this.userService.getUserLobby(user._id);
  }

  @Query(() => [SlotDto])
  getUserTeam(@CurrentUser() user: User) {
    return this.userService.getUserTeam(user._id);
  }

  @Mutation(() => User)
  updateSlot(
    @CurrentUser() user: User,
    @Args('slotCode') slotCode: string,
    @Args('userWarriorId') userWarriorId: string,
  ) {
    return this.userService.updateSlot(user._id, slotCode, userWarriorId);
  }

  @Mutation(() => User)
  updateAchievement(@CurrentUser() user: User) {
    return this.userService.updateAchievement(user._id);
  }

  @Mutation(() => User)
  async updateUserName(@CurrentUser() user: User, @Args('name') name: string) {
    return this.userService.updateUserName(user._id, name);
  }

  @Mutation(() => VoidScalar)
  @Roles(roles.ADMIN)
  async createAllMissingUserResources() {
    this.userService.createAllMissingUserResources();
  }

  @Mutation(() => VoidScalar)
  @Roles(roles.ADMIN)
  async createAllMissingTeam() {
    this.userService.createAllMissingTeam();
  }

  @Mutation(() => [RewardResourceItemDto])
  async sendReward(
    @Args('userId') userId: string,
    @Args('rewardId') rewardId: string,
  ) {
    return this.userService.sendReward(userId, rewardId);
  }

  @Mutation(() => RewardResourceItemDto)
  async applyResourceByCode(
    @Args('userId') userId: string,
    @Args('code') code: string,
  ) {
    return this.userService.applyResourceByCode(userId, code);
  }

  @Mutation(() => User)
  @Roles(roles.ADMIN)
  async addRole(@Args('userId') userId: string, @Args('role') role: string) {
    return this.userService.addRole(userId, role);
  }

  @Mutation(() => User)
  @Roles(roles.ADMIN)
  async disabledRole(
    @Args('userId') userId: string,
    @Args('role') role: string,
  ) {
    return await this.userService.disableRole(userId, role);
  }

  @Query(() => [LeaderboardDto])
  async getLeaderboard() {
    return await this.userService.getLeaderboard();
  }

  @Query(() => LeaderboardDto)
  async getOwnLeaderboard(@CurrentUser() user: User) {
    return await this.userService.getLeaderboardByUserId(user._id);
  }

  @Mutation(() => [UserReturnDto])
  async getSendMonthlyReward() {
    return await this.userService.getSendMonthlyReward();
  }

  @Mutation(() => Boolean)
  @Roles(roles.ADMIN)
  async destroyUser(@Args('userId') userId: string) {
    return await this.userService.destroyUser(userId);
  }

  @Mutation(() => Boolean)
  @Roles(roles.ADMIN)
  async destroyUsers() {
    return await this.userService.destroyAllUsers();
  }

  @Mutation(() => Boolean)
  @Roles(roles.ADMIN)
  async checkIncorrectBetaAccount() {
    return await this.userService.checkIncorrectBetaAccount();
  }

  @Mutation(() => Boolean)
  @Roles(roles.ADMIN)
  async sendRewardForLevel(
    @Args('stage') stage: number,
    @Args('rewardId') rewardId: string,
  ) {
    return this.userService.sendWardForStage(stage, rewardId);
  }
  // @ResolveProperty(() => [LoginRecord])
  // async loginRecords(@Parent() user: User) {
  //   this.logger.log(`Resolving login records for user: ${user.email}`);
  //   return await this.loginRecordService.findAllByUserId(user._id);
  // }

  @Mutation(() => User)
  addExpToUser(
    @Args('userId') userId: string,
    @Args('totalCoin') totalCoin: number,
  ) {
    return this.userService.addExpToUser(userId, totalCoin);
  }

  @Mutation(() => UserReturnDto)
  switchAvatar(
    @CurrentUser() user: User,
    @Args('avatarCode') avatarCode: string,
  ) {
    return this.userService.switchAvatar(user._id, avatarCode);
  }

  @Query(() => [String])
  getAvatars(@CurrentUser() user: User) {
    return this.userService.getAvatarByUserId(user._id);
  }

  // for demo only
  @Mutation(() => Boolean)
  campaignEnergyUsage(@CurrentUser() user: User) {
    const energyUsed = ECampaignEnergyCost.ADVENTURE;
    return this.userService.energyUsage(user._id, energyUsed);
  }
}
