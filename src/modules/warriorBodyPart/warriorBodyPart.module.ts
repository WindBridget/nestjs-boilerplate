import { Module } from '@nestjs/common';
import { WarriorModule } from '../warrior/warrior.module';
import { WarriorBodyPartResolver } from './warriorBodyPart.resolver';
import { UserWarriorModule } from '../userWarrior/userWarrior.module';

@Module({
  imports: [
    UserWarriorModule,
    WarriorModule,
  ],
  controllers: [],
  providers: [WarriorBodyPartResolver],
  exports: [],
})
export class WarriorBodyPartModule {}
