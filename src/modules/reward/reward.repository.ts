import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { RewardCreateDto } from './dtos/rewardCreate.dto';
import { Reward } from './schemas/reward.schema';

@Injectable()
export class RewardRepository extends BaseRepository<Reward> {
  constructor(
    @InjectModel(Reward) private readonly rewardModel: ModelType<Reward>,
  ) {
    super(rewardModel);
  }

  async create(createRewardDto: RewardCreateDto): Promise<Reward> {
    const newReward = new this.rewardModel(createRewardDto);
    return await newReward.save();
  }

  async findAllAndPaginateRewards(perpage, currentpage): Promise<Reward[]> {
    return await this.rewardModel.find().limit(perpage).skip(perpage * currentpage);
  }

  async countRewards(): Promise<number> {
    return await this.rewardModel.estimatedDocumentCount();
  }
}
