import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { UserReward } from 'modules/userReward/schemas/userReward.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { UserRewardDto } from './dtos/userReward.dto';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from 'modules/user/user.service';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { UserRewardService } from './userReward.service';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { EUserEvent } from 'common/constant/eventConstants';
import { QuestService } from 'modules/quest/quest.service';
import { User } from 'modules/user/schemas/user.schema';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { ClaimRewardDto } from './dtos/userClaimReward.dto';
const pubSub = new PubSub();

@Resolver(UserReward)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserRewardResolver {
  private readonly logger = new BackendLogger(UserRewardResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly userRewardService: UserRewardService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => UserReward)
  async getUserReward(@Args('id') id: string) {
    return this.userRewardService.findOneById(id);
  }

  @Mutation(() => UserReward)
  @Roles(roles.ADMIN)
  async createUserReward(@Args() createUserRewardDto: UserRewardDto) {
    this.logger.log(`Creating new userReward`);
    return await this.userRewardService.create(createUserRewardDto);
  }

  // @Subscription(() => String)
  // findUser() {
  //   return pubSub.asyncIterator('findUser');
  // }

  @Mutation(() => ClaimRewardDto)
  async claimReward(
    @CurrentUser() user: User,
    @Args('userRewardId') userRewardId: string,
  ) {
    this.logger.log(`Claim reward`);
    return await this.userRewardService.claimReward(user._id, userRewardId);
  }
}
