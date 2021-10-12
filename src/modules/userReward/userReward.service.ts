import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { UserReward } from 'modules/userReward/schemas/userReward.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { RewardService } from 'modules/reward/reward.service';
import { UserRewardRepository } from './userReward.repository';
import { UserRewardDto } from './dtos/userReward.dto';
import { UserService } from 'modules/user/user.service';
import { QuestService } from 'modules/quest/quest.service';
import { ClaimRewardDto } from './dtos/userClaimReward.dto';
import { EQuestHasClaimed } from 'common/constant/gameConstants';

@Injectable()
export class UserRewardService {
  private readonly logger = new BackendLogger(UserRewardService.name);

  constructor(
    private readonly userRewardRepository: UserRewardRepository,
    private readonly rewardService: RewardService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => QuestService))
    private readonly questService: QuestService,
  ) {}

  async findOneById(id: string) {
    return await this.userRewardRepository.findOneById(id);
  }

  async findAll() {
    return await this.userRewardRepository.findAll();
  }

  async create(createUserRewardDto: UserRewardDto): Promise<UserReward> {
    return await this.userRewardRepository.create(createUserRewardDto);
  }

  async addUserReward(payload: any) {
    const quest = await this.questService.findOneByTypeAndValue(
      payload.type,
      payload.value,
    );
    if (quest) {
      const data: UserRewardDto = {
        userId: payload.userId,
        questId: quest._id,
        rewardId: quest.rewardId,
        hasClaimed: EQuestHasClaimed.NO,
        expireAt: null,
      };
      await this.create(data);
    }
  }

  async claimReward(
    userId: string,
    userRewardId: string,
  ): Promise<ClaimRewardDto> {
    const userReward = await this.userRewardRepository.findOneById(
      userRewardId,
    );
    if (userReward && userReward.hasClaimed === EQuestHasClaimed.NO) {
      const filter = { _id: userRewardId };
      const update = { hasClaimed: EQuestHasClaimed.YES };
      await this.userRewardRepository.findOneAndUpdate(filter, update);
      await this.userService.sendReward(userId, userReward.rewardId);
      const rewards = await this.rewardService.getListRewardResource(
        userReward.rewardId,
      );
      const data = {
        rewards,
      };
      return new ClaimRewardDto(data);
    }
    return new ClaimRewardDto();
  }

  async findAllByUserIdAndQuestId(userId: string, questId: string) {
    return await this.userRewardRepository.findAllByUserIdAndQuestId(
      userId,
      questId,
    );
  }

  async findAllByUserId(userId: string): Promise<UserReward[]> {
    return await this.userRewardRepository.findAllByUserId(userId);
  }

  // @Interval(10000)
  // @Cron('* * 6 * * *')
  // handleDailyReward() {
  //   this.logger.debug('Called everyday at 6am');
  //   this.userService.setDailyRewardStage(); // up 2 -> 3 -> 4
  //   this.userService.resetDailyRewardStage(); // not online or max 7
  //   this.userService.resetDailyLoginReward(); // reset to allow receive reward
  // }
}
