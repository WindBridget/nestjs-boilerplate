import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserRewardResolver } from './userReward.resolver';
import { UserReward } from './schemas/userReward.schema';
import { RewardModule } from 'modules/reward/reward.module';
import { UserModule } from 'modules/user/user.module';
import { UserRewardService } from './userReward.service';
import { UserRewardRepository } from './userReward.repository';
import { QuestModule } from 'modules/quest/quest.module';

@Module({
  imports: [
    TypegooseModule.forFeature([UserReward]),
    RewardModule,
    forwardRef(() => UserModule),
    forwardRef(() => QuestModule),
  ],
  controllers: [],
  providers: [UserRewardResolver, UserRewardService, UserRewardRepository],
  exports: [UserRewardService, UserRewardRepository],
})
export class UserRewardModule {}
