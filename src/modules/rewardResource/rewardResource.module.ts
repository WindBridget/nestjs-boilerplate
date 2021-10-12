import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RewardResourceRepository } from './rewardResource.repository';
import { RewardResourceResolver } from './rewardResource.resolver';
import { RewardResourceService } from './rewardResource.service';
import { RewardResource } from './schemas/rewardResource.schema';

@Module({
  imports: [TypegooseModule.forFeature([RewardResource])],
  controllers: [],
  providers: [
    RewardResourceService,
    RewardResourceResolver,
    RewardResourceRepository,
  ],
  exports: [
    RewardResourceService,
    RewardResourceRepository,
  ],
})
export class RewardResourceModule {}
