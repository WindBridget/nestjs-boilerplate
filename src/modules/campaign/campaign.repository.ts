import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository } from 'common/repository/base.repository';
import {
  Campaign,
  CampaignModel,
} from 'modules/campaign/schemas/campaign.schema';
import { CampaignDto } from './dtos/campaign.dto';

@Injectable()
export class CampaignRepository extends BaseRepository<Campaign> {
  constructor(
    @InjectModel(Campaign) private readonly campaignModel: ModelType<Campaign>,
  ) {
    super(campaignModel);
  }

  async create(createCampaignDto: CampaignDto): Promise<Campaign> {
    const newCampaign = new this.campaignModel(createCampaignDto);
    return await newCampaign.save();
  }

  async findAllAndPaginateCapaign(perpage, currentpage): Promise<Campaign[]> {
    return await this.campaignModel.find().limit(perpage).skip(perpage * currentpage);
  }

  async countCompaign(): Promise<Number> {
    return await this.campaignModel.estimatedDocumentCount();
  }
}
