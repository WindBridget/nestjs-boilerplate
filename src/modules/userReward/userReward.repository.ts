import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository } from 'common/repository/base.repository';
import {
  UserReward,
  UserRewardModel,
} from 'modules/userReward/schemas/userReward.schema';
import { UserRewardDto } from './dtos/userReward.dto';

@Injectable()
export class UserRewardRepository extends BaseRepository<UserReward> {
  constructor(
    @InjectModel(UserReward)
    private readonly userRewardModel: ModelType<UserReward>,
  ) {
    super(userRewardModel);
  }

  async create(createUserRewardDto: UserRewardDto): Promise<UserReward> {
    const newUserReward = new this.userRewardModel(createUserRewardDto);
    return await newUserReward.save();
  }

  async findAllByUserIdAndQuestId(userId: string, questId: string) {
    return await this.userRewardModel.find({ userId, questId });
  }

  async findAllByUserId(userId: string) {
    return await this.userRewardModel.find({ userId });
  }
}
