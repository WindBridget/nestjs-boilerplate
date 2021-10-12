import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { EScheduleStatus } from 'common/constant/gameConstants';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { QuestRepository } from 'modules/quest/quest.repository';

@Injectable()
export class QuestWorkerService {
  private readonly logger = new BackendLogger(QuestWorkerService.name);
  constructor(
    private readonly questRepository: QuestRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  @Cron('0 * * * * *')
  async handleApplySchedule() {
    this.logger.log('handle Schedule!');
    const schedules = await this.questRepository.getSchedules();
    console.log(schedules);
    await Promise.all(
      schedules.map(async (schedule) => {
        const d = new Date();
        this.logger.log(schedule.status);
        schedule.status = EScheduleStatus.Executing;
        schedule.lastExecutionAt = d;
        schedule.nextExecutionAt = new Date(d.getTime() + schedule.duration);
        const sche = await this.questRepository.updateSchedule(schedule);
        setTimeout(async () => {
          sche.status = EScheduleStatus.Pending;
          await this.questRepository.updateSchedule(sche);
          this.logger.log('updating');
        }, sche.eventDuration);
      }),
    );
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  //   this.userService.getSendMonthlyReward();
  // }
}
