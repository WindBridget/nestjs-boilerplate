import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Quest } from 'modules/quest/schemas/quest.schema';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { CreateQuestDto } from './dtos/createQuest.dto';
import { QuestService } from './quest.service';
import { UserQuest } from './schemas/userQuest.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserService } from 'modules/user/user.service';
import { EUserEvent } from 'common/constant/eventConstants';
import { UserMetaService } from 'modules/userMeta/userMeta.service';
import { QuestDto } from './dtos/quest.dto';
import { ScheduleDto } from './dtos/schedule.dto';
import { Schedule } from './schemas/schedule.schema';
import { User } from 'modules/user/schemas/user.schema';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { BeginnerLoginRewardDto } from './dtos/beginnerLoginRewardInfo.dto';

@Resolver(Quest)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class QuestResolver {
  private readonly logger = new BackendLogger(QuestResolver.name);

  constructor(
    private readonly questService: QuestService,
    private readonly userService: UserService,
    private readonly userMetaService: UserMetaService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => Quest)
  async getQuest(@Args('id') id: string) {
    return this.questService.findOneById(id);
  }

  @Mutation(() => Quest)
  @Roles(roles.ADMIN)
  async createQuest(@Args() createQuestDto: CreateQuestDto) {
    this.logger.log(`Creating new quest`);
    return await this.questService.createQuest(createQuestDto);
  }

  // for demo only
  @Mutation(() => UserQuest)
  async createUserQuest(@Args('userId') userId: string): Promise<UserQuest[]> {
    this.logger.log(`Creating new user quest`);
    return await this.questService.createUserQuest(userId);
  }

  // auto claim reward
  // @OnEvent(EUserEvent.USER_LOGIN)
  // async dailyReward(payload: any) {
  //   const rewardId = await this.questService.getDailyRewardIdByUserId(
  //     payload.userId,
  //   );
  //   this.userService.sendReward(payload.userId, rewardId);
  // }

  @OnEvent(EUserEvent.USER_LOGIN)
  async loginEventHandler(payload: any) {
    const userMeta = await this.userMetaService.findOneByUserId(payload.userId);
    const startToday = new Date(new Date().toDateString());
    const startUpdateDay = new Date(
      new Date(userMeta.lastLoginAt).toDateString(),
    );
    if (startToday.getTime() !== startUpdateDay.getTime()) {
      this.eventEmitter.emit(EUserEvent.USER_LOGIN_NEW, {
        userId: payload.userId,
      });
    }
    // if (userMeta && userMeta.hasLoginToday === false) {
    //   this.eventEmitter.emit(EUserEvent.USER_LOGIN_NEW, {
    //     userId: payload.userId,
    //   });
    // }
  }

  @OnEvent(EUserEvent.USER_LOGIN_NEW)
  async updateBeginnerDailyProgress(payload: any) {
    await this.questService.updateBeginnerDailyProgressByUserId(payload.userId);
  }

  @Query(() => [BeginnerLoginRewardDto])
  async getBeginnerLoginRewardInfo(
    @CurrentUser() user: User,
  ): Promise<BeginnerLoginRewardDto[]> {
    return await this.questService.getBeginnerLoginRewardInfo(user._id);
  }

  @Mutation(() => Schedule)
  @Roles(roles.ADMIN)
  async createSchedule(@Args() createScheduleDto: ScheduleDto) {
    this.logger.log(`Creating new Schedule`);
    return await this.questService.createSchedule(createScheduleDto);
  }
}
