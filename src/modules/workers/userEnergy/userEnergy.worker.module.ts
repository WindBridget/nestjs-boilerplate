import { Module } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { UserEnergyWorkerService } from './userEnergy.worker.service';

@Module({
  imports: [UserModule],
  providers: [UserEnergyWorkerService],
})
export class UserEnergyWorkersModule {}
