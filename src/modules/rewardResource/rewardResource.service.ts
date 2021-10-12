import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { RewardResource } from 'modules/rewardResource/schemas/rewardResource.schema';
import { RewardResourceDto } from './dtos//rewardResource.dto';
import { RewardResourceRepository } from './rewardResource.repository';

@Injectable()
export class RewardResourceService {
  private readonly logger = new BackendLogger(RewardResourceService.name);

  constructor(
    private readonly rewardResourceRepository: RewardResourceRepository,
  ) {}

  async findOneById(id: string) {
    return await this.rewardResourceRepository.findOneById(id);
  }

  async findAll() {
    return await this.rewardResourceRepository.findAll();
  }

  async create(
    createRewardResourceDto: RewardResourceDto,
  ): Promise<RewardResource> {
    return await this.rewardResourceRepository.create(createRewardResourceDto);
  }
}
