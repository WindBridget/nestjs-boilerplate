import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { RewardResource } from 'modules/rewardResource/schemas/rewardResource.schema';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { RewardResourceDto } from './dtos/rewardResource.dto';
import { RewardResourceService } from './rewardResource.service';

@Resolver(RewardResource)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class RewardResourceResolver {
  private readonly logger = new BackendLogger(RewardResourceResolver.name);

  constructor(private readonly rewardResourceService: RewardResourceService) {}

  @Query(() => RewardResource)
  async rewardResource(@Args('id') id: string) {
    return this.rewardResourceService.findOneById(id);
  }

}
