import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { User } from 'modules/user/schemas/user.schema';
import { UserResource } from 'modules/userResource/schemas/userResource.schema';
import { UserResourceListDto } from './dtos/userResourceListDto';
import { UserResourceReturnDto } from './dtos/userResourceReturn.dto';
import { UserResourceUpgradeDto } from './dtos/userResourceUpgradeDto';
import { UserResourceService } from './userResource.service';

@Resolver(UserResource)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserResourceResolver {
  private readonly logger = new BackendLogger(UserResourceResolver.name);

  constructor(private readonly userResourceService: UserResourceService) {}

  @Query(() => UserResourceReturnDto)
  async getResourceDetail(@Args('userResourceId') userResourceId: string) {
    return this.userResourceService.getResourceDetail(userResourceId);
  }

  @Query(() => UserResourceListDto)
  async getUserResourcesByType(
    @CurrentUser() user: User,
    @Args('type') type: string,
  ) {
    return await this.userResourceService.getUserResourcesByType(
      user._id,
      type,
    );
  }

  @Query(() => [UserResourceReturnDto])
  getUserResourceHeader(@CurrentUser() user: User) {
    return this.userResourceService.getUserResourceHeader(user._id);
  }

  @Query(() => UserResourceUpgradeDto)
  getUserResourcesByTypeAndElement(
    @CurrentUser() user: User,
    @Args('type') type: string,
    @Args('element') element: string,
  ) {
    return this.userResourceService.getUserResourcesByTypeAndElement(
      user._id,
      type,
      element,
    );
  }
}
