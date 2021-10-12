import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SchedulerRegistry } from '@nestjs/schedule';
import { roles } from 'common/constant/constants';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { LoginRecordService } from 'modules/loginRecord/loginRecord.service';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { User } from 'modules/user/schemas/user.schema';
import { UserService } from './user.service';
// import { NotificationStatusService } from 'src/notificationStatus/notificationStatus.service';

@Resolver(User)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserResolver {
  private readonly logger = new BackendLogger(UserResolver.name);
  // private readonly notificationStatusService: NotificationStatusService,
  constructor(
    private readonly userService: UserService,
    private readonly loginRecordService: LoginRecordService,
  ) {}

  @Query(() => [User])
  getAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => [User])
  @Roles(roles.ADMIN)
  getAllUsersByAdmin(
    @Args('perpage') perpage: number,
    @Args('currentpage') currentpage: number,
  ) {
    return this.userService.getAllUserByAdmin(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countUsers() {
    return this.userService.countUsers();
  }

  @Query(() => User)
  async getUser(@CurrentUser() user: User) {
    return this.userService.findOneById(user._id);
  }

}
