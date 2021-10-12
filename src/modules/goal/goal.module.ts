import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { GoalRepository } from './goal.repository';
import { GoalResolver } from './goal.resolver';
import { GoalService } from './goal.service';
import { Goal } from './schemas/goal.schema';

@Module({
  imports: [TypegooseModule.forFeature([Goal])],
  controllers: [],
  providers: [GoalService, GoalResolver, GoalRepository],
  exports: [GoalService, GoalRepository],
})
export class GoalModule {}
