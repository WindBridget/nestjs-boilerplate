import { forwardRef, Module } from '@nestjs/common';
import { WalletAddressScalar } from 'common/scalars/wallet_address.scalar';
import { CampaignModule } from 'modules/campaign/campaign.module';
import { GoalModule } from 'modules/goal/goal.module';
import { LoginRecordModule } from 'modules/loginRecord/loginRecord.module';
import { QuestModule } from 'modules/quest/quest.module';
import { ResourceModule } from 'modules/resource/resource.module';
import { RewardModule } from 'modules/reward/reward.module';
import { Role } from 'modules/user/schemas/role.schema';
import { User } from 'modules/user/schemas/user.schema';
import { UserResourceModule } from 'modules/userResource/userResource.module';
import { UserWarriorModule } from 'modules/userWarrior/userWarrior.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { BetaAccount } from './schemas/betaAccount.schema';
import { Slot } from './schemas/slot.schema';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypegooseModule.forFeature([User, Role, Slot, BetaAccount]),
    LoginRecordModule,
    UserResourceModule,
    ResourceModule,
    UserWarriorModule,
    RewardModule,
    GoalModule,
    CampaignModule,
    forwardRef(() => QuestModule),
  ],
  controllers: [],
  providers: [UserService, UserResolver, UserRepository, WalletAddressScalar],
  exports: [UserService, UserRepository],
})
export class UserModule {}
