import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { Quest } from 'modules/quest/schemas/quest.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { CreateQuestDto } from './dtos/createQuest.dto';
import { QuestDto } from './dtos/quest.dto';
import { ScheduleDto } from './dtos/schedule.dto';
import { UserQuestDto } from './dtos/userquest.dto';
import { Schedule } from './schemas/schedule.schema';
import { UserQuest } from './schemas/userQuest.schema';

@Injectable()
export class QuestRepository extends BaseRepository<Quest> {
  constructor(
    @InjectModel(Quest) private readonly questModel: ModelType<Quest>,
    @InjectModel(UserQuest)
    private readonly userQuestModel: ModelType<UserQuest>,
    @InjectModel(Schedule) private readonly scheduleModel: ModelType<Schedule>,
  ) {
    super(questModel);
  }

  async createQuest(dto: CreateQuestDto): Promise<Quest> {
    const newQuest = new this.questModel(dto);
    return await newQuest.save();
  }

  async findDistinctActiveQuest(
    opts: any = {},
    opts2: any = {},
  ): Promise<string[]> {
    return await this.questModel.distinct(opts, opts2);
  }

  async findQuestsByType(type: string): Promise<Quest[]> {
    return await this.questModel.find({ type }).lean();
  }

  async createUserQuest(dto: UserQuestDto): Promise<UserQuest> {
    const newUserQuest = new this.userQuestModel(dto);
    return await newUserQuest.save();
  }

  async getSchedules(): Promise<Schedule[]> {
    return await this.scheduleModel.find({
      nextExecutionAt: {
        $lte: new Date(),
      },
    });
  }

  async createSchedule(dto: ScheduleDto): Promise<Schedule> {
    const newShedule = new this.scheduleModel(dto);
    return await newShedule.save();
  }

  async updateSchedule(schedule: Schedule): Promise<Schedule> {
    return await this.scheduleModel.findByIdAndUpdate(schedule._id, schedule);
  }
}
