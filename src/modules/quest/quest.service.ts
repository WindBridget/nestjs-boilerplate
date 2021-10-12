import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EUserEvent } from 'common/constant/eventConstants';
import {
  EQuestStatus,
  EUserQuestStatus,
  EQuestTotalByType,
  EQuestType,
  EQuestHasClaimed,
  EUserRewardId,
} from 'common/constant/gameConstants';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Quest } from 'modules/quest/schemas/quest.schema';
import { UserRewardService } from 'modules/userReward/userReward.service';
import { BeginnerLoginRewardDto } from './dtos/beginnerLoginRewardInfo.dto';
import { CreateQuestDto } from './dtos/createQuest.dto';
import { QuestDto } from './dtos/quest.dto';
import { ScheduleDto } from './dtos/schedule.dto';
import { QuestCreatedEvent } from './events/quest-created.event';
import { QuestRepository } from './quest.repository';
import { Schedule } from './schemas/schedule.schema';
import { UserQuest } from './schemas/userQuest.schema';
import { UserQuestRepository } from './userQuest.repository';

@Injectable()
export class QuestService {
  private readonly logger = new BackendLogger(QuestService.name);

  constructor(
    private readonly questRepository: QuestRepository,
    private readonly userQuestRepository: UserQuestRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly userRewardService: UserRewardService,
  ) {}

  async findOneById(id: string) {
    return await this.questRepository.findOneById(id);
  }

  async findAll(opts: any = {}) {
    return await this.questRepository.findAll(opts);
  }

  async createQuest(createQuestDto: CreateQuestDto): Promise<Quest> {
    return await this.questRepository.createQuest(createQuestDto);
  }

  checkRequireTotalByQuestType(type: string): number {
    if (type) {
      return EQuestTotalByType.BEGINNER_LOGIN_REWARD_TOTAL;
    }
  }

  async createUserQuest(userId: string): Promise<UserQuest[]> {
    const questTypes = await this.questRepository.findDistinctActiveQuest(
      'type',
      { status: EUserQuestStatus.IN_PROGRESS },
    );

    const userQuests = await Promise.all(
      questTypes.map(async (quest) => {
        return await this.questRepository.createUserQuest({
          userId,
          questType: quest,
          status: EUserQuestStatus.IN_PROGRESS,
          requireTotal: this.checkRequireTotalByQuestType(quest),
        });
      }),
    );

    this.eventEmitter.emit(EUserEvent.USER_QUEST_CREATED, { userId });
    return userQuests;
  }

  async updateBeginnerDailyProgressByUserId(userId: string) {
    const filter = {
      userId,
      questType: EQuestType.BEGINNER_LOGIN_REWARD,
    };
    const userQuest = await this.userQuestRepository.findOneByUserId(
      filter.userId,
      filter.questType,
    );
    const { current, requireTotal } = userQuest;
    if (current < requireTotal) {
      const newCurrent = current + 1;
      const update = { current: newCurrent };
      await this.userQuestRepository.findOneAndUpdate(filter, update);
      await this.userRewardService.addUserReward({
        userId,
        type: EQuestType.BEGINNER_LOGIN_REWARD,
        value: newCurrent,
      });
    }
  }

  async findOneByTypeAndValue(type: string, value: number) {
    return await this.questRepository.findOne({ type, value });
  }

  async createSchedule(createScheduleDto: ScheduleDto): Promise<Schedule> {
    return await this.questRepository.createSchedule(createScheduleDto);
  }

  async getBeginnerLoginRewardInfo(
    userId: string,
  ): Promise<BeginnerLoginRewardDto[]> {
    const type = EQuestType.BEGINNER_LOGIN_REWARD;
    const quests = await this.questRepository.findQuestsByType(type);
    const userRewardsForQuest = await this.userRewardService.findAllByUserId(
      userId,
    );
    const data = quests.map((quest) => {
      const userReward = userRewardsForQuest.find((item) => {
        return item.questId.toString() === quest._id.toString();
      });
      const obj = {
        ...quest,
        hasClaimed:
          userReward !== undefined
            ? userReward.hasClaimed
            : EQuestHasClaimed.LOCKED,
        userRewardId:
          userReward !== undefined ? userReward._id : EUserRewardId.NULL,
      };
      return new BeginnerLoginRewardDto(obj);
    });
    return data;
  }
}
