import { Injectable } from '@nestjs/common';
import { ECampaignEnergyCost } from 'common/constant/gameConstants';
import { Campaign } from 'modules/campaign/schemas/campaign.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { RewardService } from 'modules/reward/reward.service';
import { Slot } from 'modules/user/schemas/slot.schema';
import { CampaignRepository } from './campaign.repository';
import { CampaignDto } from './dtos/campaign.dto';
import { CampaignInfoDto } from './dtos/campaignInfo.dto';

@Injectable()
export class CampaignService {
  private readonly logger = new BackendLogger(CampaignService.name);

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly rewardService: RewardService,
  ) {}

  async findOneById(id: string) {
    return await this.campaignRepository.findOneById(id);
  }

  async findAll() {
    return await this.campaignRepository.findAll();
  }

  async findAllAndPaginateCapaign(perpage, currentpage) {
    return await this.campaignRepository.findAllAndPaginateCapaign(
      perpage,
      currentpage,
    );
  }

  async countCampaign() {
    return await this.campaignRepository.countCompaign();
  }

  async create(createCampaignDto: CampaignDto): Promise<Campaign> {
    return await this.campaignRepository.create(createCampaignDto);
  }

  async getReawardIdByStage(stage: number): Promise<string> {
    let campaign;
    if (stage <= 150) {
      campaign = await this.campaignRepository.findOne({ stage });
    } else {
      campaign = await this.campaignRepository.findOne({
        stage: { $gte: 130, $lte: 150 },
      });
    }
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign.rewardId;
  }

  async getCampaignInfo(
    stage: number,
    team: Slot[],
    energy: number,
  ): Promise<CampaignInfoDto> {
    let campaign;
    if (stage <= 150) {
      campaign = await this.campaignRepository.findOne({ stage });
    } else {
      campaign = await this.campaignRepository.findOne({
        stage: { $gte: 130, $lte: 150 },
      });
    }
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    const rewards = await this.rewardService.getListRewardResource(
      campaign.rewardId,
    );

    const checkEnergy = energy >= ECampaignEnergyCost.ADVENTURE;
    const checkWarriorSlot = team.some((slot) => slot.userWarrior != null);
    const canStart = checkEnergy && checkWarriorSlot;
    // const canStart = team.every((slot) => slot.userWarrior != null);
    const data = {
      stage: campaign.stage,
      description: campaign.description,
      rewards,
      canStart,
    };
    return new CampaignInfoDto(data);
  }
}
