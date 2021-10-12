import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import {
  DEFAULT_ENERGY_REGEN,
  DEFAULT_ENERGY_REGEN_TIME,
  DEFAULT_MAX_ENERGY,
} from 'common/constant/gameConstants';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class UserEnergyWorkerService {
  private readonly logger = new BackendLogger(UserEnergyWorkerService.name);

  constructor(private readonly userService: UserService) {}

  // @Cron('*/10 * * * * *')
  @Interval(DEFAULT_ENERGY_REGEN_TIME * 60000)
  handleInterval() {
    this.logger.debug('Called every 1 minute');
    this.userService.energyRecover(DEFAULT_ENERGY_REGEN, DEFAULT_MAX_ENERGY);
  }
}
