import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CampaignService } from './campaign.service';
import { CampaignResolver } from './campaign.resolver';
import { Campaign } from './schemas/campaign.schema';
import { CampaignRepository } from './campaign.repository';
import { RewardModule } from 'modules/reward/reward.module';

@Module({
  imports: [TypegooseModule.forFeature([Campaign]), RewardModule],
  controllers: [],
  providers: [CampaignService, CampaignResolver, CampaignRepository],
  exports: [CampaignService, CampaignRepository],
})
export class CampaignModule {}
