import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { roles } from 'common/constant/constants';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserMetaService } from './userMeta.service';
import { UserMeta } from 'modules/userMeta/schemas/userMeta.schema';
import { UserMetaDto } from './dtos/userMeta.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EUserEvent } from 'common/constant/eventConstants';

@Resolver(UserMeta)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserMetaResolver {
  private readonly logger = new BackendLogger(UserMetaResolver.name);

  constructor(private readonly userMetaService: UserMetaService) {}

  @Query(() => UserMeta)
  async getUserMeta(@Args('id') id: string) {
    return this.userMetaService.findOneById(id);
  }

  @Mutation(() => UserMeta)
  @Roles(roles.ADMIN)
  async createUserMeta(@Args() createUserMetaDto: UserMetaDto) {
    this.logger.log(`Creating new userMeta`);
    return await this.userMetaService.create(createUserMetaDto);
  }

  @OnEvent(EUserEvent.USER_LOGIN)
  async updateUserMetaLoginStatus(payload: any) {
    this.userMetaService.findOneAndUpdateLoginByUserId(payload.userId);
  }
}
