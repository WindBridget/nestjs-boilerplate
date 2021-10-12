import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { QuestService } from './quest.service';
import { QuestResolver } from './quest.resolver';
import { Quest } from './schemas/quest.schema';
import { QuestRepository } from './quest.repository';
import { UserQuest } from './schemas/userQuest.schema';
import { Event } from './schemas/event.schema';
import { Schedule } from './schemas/schedule.schema';
import { UserQuestRepository } from './userQuest.repository';
import { UserModule } from 'modules/user/user.module';
import { UserMetaModule } from 'modules/userMeta/userMeta.module';
import { UserRewardModule } from 'modules/userReward/userReward.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Quest, UserQuest, Event, Schedule]),
    forwardRef(() => UserModule),
    UserMetaModule,
    forwardRef(() => UserRewardModule),
  ],
  controllers: [],
  providers: [
    QuestService,
    QuestResolver,
    QuestRepository,
    UserQuestRepository,
  ],
  exports: [QuestService, QuestRepository, UserQuestRepository],
})
export class QuestModule {}
