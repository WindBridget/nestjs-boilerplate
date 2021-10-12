import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository } from 'common/repository/base.repository';
import { Goal } from 'modules/goal/schemas/goal.schema';
import { GoalDto } from './dtos/goal.dto';

@Injectable()
export class GoalRepository extends BaseRepository<Goal> {
  constructor(@InjectModel(Goal) private readonly goalModel: ModelType<Goal>) {
    super(goalModel);
  }

  async create(createGoalDto: GoalDto): Promise<Goal> {
    const newGoal = new this.goalModel(createGoalDto);
    return await newGoal.save();
  }

  async findAllAndPaginateGameConfig(perpage, currentpage): Promise<Goal[]> {
    return await this.goalModel.find().limit(perpage).skip(perpage * currentpage);
  }
}
