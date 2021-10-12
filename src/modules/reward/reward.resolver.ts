import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { RewardResourceCreateDto } from 'modules/rewardResource/dtos/rewardResourceCreate.dto';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { RewardCreateDto } from './dtos/rewardCreate.dto';
import { RewardService } from './reward.service';
import { Reward } from './schemas/reward.schema';

@Resolver(Reward)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class RewardResolver {
  private readonly logger = new BackendLogger(RewardResolver.name);

  constructor(private readonly rewardService: RewardService) { }

  @Query(() => Reward)
  async reward(@Args('id') id: string) {
    return this.rewardService.findOneById(id);
  }

  @Query(() => [Reward])
  @Roles(roles.ADMIN)
  getRewards(@Args('perpage') perpage: number, @Args('currentpage') currentpage: number) {
    return this.rewardService.getRewards(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countRewards() {
    return this.rewardService.countRewards();
  }

  @Mutation(() => Reward)
  @Roles(roles.ADMIN)
  async createReward(
    @Args() createRewardDto: RewardCreateDto,
    @Args({
      name: 'rewardResourceCreateDtos',
      type: () => [RewardResourceCreateDto],
    })
    rewardResourceCreateDtos: RewardResourceCreateDto[],
  ) {
    this.logger.log(`Creating new reward ${createRewardDto}`);
    return await this.rewardService.createReward(
      createRewardDto,
      rewardResourceCreateDtos,
    );
  }
}
