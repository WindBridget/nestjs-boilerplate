import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { ResourceRepository } from 'modules/resource/resource.repository';
import { RewardResourceDto } from 'modules/rewardResource/dtos/rewardResource.dto';
import { RewardResourceCreateDto } from 'modules/rewardResource/dtos/rewardResourceCreate.dto';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { RewardResourceRepository } from 'modules/rewardResource/rewardResource.repository';
import { RewardResource } from 'modules/rewardResource/schemas/rewardResource.schema';
import { RewardCreateDto } from './dtos/rewardCreate.dto';
import { RewardRepository } from './reward.repository';
import { Reward } from './schemas/reward.schema';

@Injectable()
export class RewardService {
  private readonly logger = new BackendLogger(RewardService.name);

  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly rewardResourceRepository: RewardResourceRepository,
    private readonly resourceRepository: ResourceRepository,
  ) {}

  async findOneById(id: string) {
    return await this.rewardRepository.findOneById(id);
  }

  async findAll() {
    return await this.rewardRepository.findAll();
  }

  async getRewards(perpage: number, currentPage: number) {
    return await this.rewardRepository.findAllAndPaginateRewards(perpage, currentPage);
  }

  async countRewards() {
    return await this.rewardRepository.countRewards();
  }

  async create(rewardDto: RewardCreateDto): Promise<Reward> {
    return await this.rewardRepository.create(rewardDto);
  }

  async getListRewardResource(
    rewardId: string,
  ): Promise<RewardResourceItemDto[]> {
    const reward = await this.findOneById(rewardId);
    if (!reward) {
      return [];
    }
    return reward.rewardResources.map(
      (rewardResource) => new RewardResourceItemDto(rewardResource),
    );
  }

  async getRewardResource(code: string): Promise<RewardResourceItemDto> {
    const rewardResource = await this.rewardResourceRepository.findOne({
      'resource.code': code,
    });
    return new RewardResourceItemDto(rewardResource);
  }

  async createResource(
    rewardId: string,
    rewardResourceCreateDto: RewardResourceCreateDto,
  ): Promise<Reward> {
    const resource = await this.resourceRepository.findOne({
      code: rewardResourceCreateDto.resourceCode,
    });
    const rewardResourceDto: RewardResourceDto = {
      resource,
      value: rewardResourceCreateDto.value,
    };
    const rewardResource = await this.rewardResourceRepository.create(
      rewardResourceDto,
    );
    return await this.rewardRepository.findByIdAndUpdate(
      rewardId,
      {
        $push: {
          rewardResources: {
            _id: rewardResource._id,
            resource: rewardResource.resource,
            value: rewardResource.value,
          },
        },
      },
      true,
    );
  }

  async createReward(
    createRewardDto: RewardCreateDto,
    rewardResourceCreateDtos: RewardResourceCreateDto[],
  ): Promise<Reward> {
    const reward = await this.create(createRewardDto);
    await Promise.all(
      rewardResourceCreateDtos.map(async (rewardResourceCreateDto) => {
        await this.createResource(reward._id, rewardResourceCreateDto);
      }),
    );
    return reward;
  }

}
