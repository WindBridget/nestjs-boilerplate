import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { Video } from 'modules/videos/schemas/video.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { VideoDto } from './dtos/video.dto';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from 'modules/user/user.service';
import { User } from 'modules/user/schemas/user.schema';
const pubSub = new PubSub();

@Resolver(Video)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class VideoResolver {
  private readonly logger = new BackendLogger(VideoResolver.name);

  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async video(@Args('id') id: string) {
    const user = this.userService.findOneById(id);
    pubSub.publish('findUser', { findUser: 'Some one found a user' });
    // pubSub.publish('findUser', { findUser: user });
    return user;
  }

  // @Subscription(() => User)
  @Subscription(() => String)
  findUser() {
    return pubSub.asyncIterator('findUser');
  }
}
