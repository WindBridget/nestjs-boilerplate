import { Module } from '@nestjs/common';
import { ResourceModule } from 'modules/resource/resource.module';
import { RewardResourceModule } from 'modules/rewardResource/rewardResource.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { RewardRepository } from './reward.repository';
import { RewardResolver } from './reward.resolver';
import { RewardService } from './reward.service';
import { Reward } from './schemas/reward.schema';

@Module({
  imports: [
    TypegooseModule.forFeature([Reward]),
    RewardResourceModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [RewardService, RewardResolver, RewardRepository],
  exports: [RewardService, RewardRepository],
})
export class RewardModule {}
