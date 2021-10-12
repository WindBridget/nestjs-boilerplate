import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { RewardResource } from 'modules/rewardResource/schemas/rewardResource.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { RewardResourceDto } from './dtos/rewardResource.dto';

@Injectable()
export class RewardResourceRepository extends BaseRepository<RewardResource> {
  constructor(
    @InjectModel(RewardResource)
    private readonly rewardResourceModel: ModelType<RewardResource>,
  ) {
    super(rewardResourceModel);
  }

  async create(
    createRewardResourceDto: RewardResourceDto,
  ): Promise<RewardResource> {
    const newRewardResource = new this.rewardResourceModel(
      createRewardResourceDto,
    );
    return await newRewardResource.save();
  }
}
