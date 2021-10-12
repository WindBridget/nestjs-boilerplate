import { Module } from '@nestjs/common';
import { QuestWorkersModule } from './questing/quest.worker.module';
import { RankWorkersModule } from './ranking/rank.workers.module';
import { UserEnergyWorkersModule } from './userEnergy/userEnergy.worker.module';

@Module({
  imports: [RankWorkersModule, QuestWorkersModule, UserEnergyWorkersModule],
  controllers: [],
  providers: [],
})
export class WorkersModule {}
