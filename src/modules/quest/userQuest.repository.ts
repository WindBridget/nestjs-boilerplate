import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { UserQuestDto } from './dtos/userquest.dto';
import { UserQuest } from './schemas/userQuest.schema';

@Injectable()
export class UserQuestRepository extends BaseRepository<UserQuest> {
  constructor(
    @InjectModel(UserQuest)
    private readonly userQuestModel: ModelType<UserQuest>,
  ) {
    super(userQuestModel);
  }

  async createUserQuest(dto: UserQuestDto): Promise<UserQuest> {
    const newUserQuest = new this.userQuestModel(dto);
    return await newUserQuest.save();
  }

  async findOneByUserId(userId: string, questType: string): Promise<UserQuest> {
    return await this.findOne({ userId, questType });
  }
}
