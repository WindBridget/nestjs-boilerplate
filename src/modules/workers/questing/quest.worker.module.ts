import { Module } from '@nestjs/common';
import { QuestModule } from 'modules/quest/quest.module';
import { QuestWorkerService } from './quest.worker.sevice';

@Module({
  imports: [
    QuestModule,
  ],
  providers: [QuestWorkerService],
})
export class QuestWorkersModule { }
