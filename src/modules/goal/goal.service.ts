import { Injectable } from '@nestjs/common';
import { EGoalType } from 'common/constant/gameConstants';
import { Goal } from 'modules/goal/schemas/goal.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GoalDto } from './dtos/goal.dto';
import { GoalRepository } from './goal.repository';

@Injectable()
export class GoalService {
  private readonly logger = new BackendLogger(GoalService.name);

  constructor(private readonly goalRepository: GoalRepository) {}

  async findOneById(id: string) {
    return await this.goalRepository.findOneById(id);
  }

  async findAll() {
    return await this.goalRepository.findAll();
  }

  async findAllAndPaginateGameConfig(perpage, currentpage) {
    return await this.goalRepository.findAllAndPaginateGameConfig(perpage, currentpage);
  }

  async countGoals() {
    return await this.goalRepository.count({});
  }

  async create(createGoalDto: GoalDto): Promise<Goal> {
    return await this.goalRepository.create(createGoalDto);
  }

  async getRewardByType(type: string, value: number): Promise<string> {
    const goal = await this.goalRepository.findOne({
      type,
      $and: [
        {
          start: {
            $lte: value,
          },
        },
        {
          end: {
            $gte: value,
          },
        },
      ],
    });
    if (!goal) {
      this.logger.verbose('does not have any reward');
      return '';
    }
    return goal.rewardId;
  }
}
