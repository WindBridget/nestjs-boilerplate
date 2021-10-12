import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GameConfigModule } from 'modules/gameConfig/gameConfig.module';
import { UserModule } from 'modules/user/user.module';
import { RankWorkerService } from './rank.worker.service';

@Module({
  imports: [
    UserModule,
  ],
  providers: [RankWorkerService],
})
export class RankWorkersModule {}
