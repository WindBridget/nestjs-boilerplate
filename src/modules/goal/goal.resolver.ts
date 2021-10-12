import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { Goal } from 'modules/goal/schemas/goal.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { GoalDto } from './dtos/goal.dto';
import { GoalService } from './goal.service';

@Resolver(Goal)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class GoalResolver {
  private readonly logger = new BackendLogger(GoalResolver.name);

  constructor(private readonly goalService: GoalService) {}

  @Query(() => Goal)
  async getGoal(@Args('id') id: string) {
    return this.goalService.findOneById(id);
  }

  @Query(() => [Goal])
  @Roles(roles.ADMIN)
  async getGoals(@Args('perpage') perpage: number,@Args('currentpage') currentpage: number) {
    return this.goalService.findAllAndPaginateGameConfig(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  async countGoals() {
    return this.goalService.countGoals();
  }

  @Mutation(() => Goal)
  @Roles(roles.ADMIN)
  async createGoal(@Args() createGoalDto: GoalDto) {
    this.logger.log(`Creating new goal`);
    return await this.goalService.create(createGoalDto);
  }
}
