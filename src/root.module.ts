import { Module } from '@nestjs/common';
import { GameConfigModule } from 'modules/gameConfig/gameConfig.module';
import { WarriorModule } from 'modules/warrior/warrior.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { UserModule } from 'modules/user/user.module';
import { UserWarriorModule } from 'modules/userWarrior/userWarrior.module';
import { UserResourceModule } from 'modules/userResource/userResource.module';
import { RewardModule } from 'modules/reward/reward.module';
import { RewardResourceModule } from 'modules/rewardResource/rewardResource.module';
import { VoidScalar } from 'common/scalars/void.scalar';
import { CampaignModule } from 'modules/campaign/campaign.module';
import { GoalModule } from 'modules/goal/goal.module';
import { WarriorBodyPartModule } from 'modules/warriorBodyPart/warriorBodyPart.module';
import { QuestModule } from 'modules/quest/quest.module';
import { UserMetaModule } from 'modules/userMeta/userMeta.module';
import { SkillModule } from 'modules/skill/skill.module';
import { OrderModule } from 'modules/order/order.module';

@Module({
  imports: [
    GameConfigModule,
    UserModule,
    ResourceModule,
    UserResourceModule,
    WarriorModule,
    UserWarriorModule,
    RewardModule,
    RewardResourceModule,
    CampaignModule,
    GoalModule,
    WarriorBodyPartModule,
    QuestModule,
    UserMetaModule,
    SkillModule,
    OrderModule,
  ],
  controllers: [],
  providers: [VoidScalar],
})
export class RootModule {}
