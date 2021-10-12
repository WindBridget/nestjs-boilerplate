import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PubSub } from 'graphql-subscriptions';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class RankWorkerService {
  private readonly logger = new BackendLogger(RankWorkerService.name);
  // public pubSub = new PubSub();

  constructor(private readonly userService: UserService) {}

  @Cron('0 0 0 1 * *')
  handleTournamentRoundFinish() {
    // this.logger.debug('handleTournamentRoundFinish');
    this.userService.getSendMonthlyReward();
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  //   this.userService.getSendMonthlyReward();
  // }
}
