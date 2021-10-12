import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Resource } from 'modules/resource/schemas/resource.schema';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { ResourceDto } from './dtos/resource.dto';
import { ResourceService } from './resource.service';

@Resolver(Resource)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class ResourceResolver {
  private readonly logger = new BackendLogger(ResourceResolver.name);

  constructor(private readonly resourceService: ResourceService) {}

  @Mutation(() => Resource)
  @Roles(roles.ADMIN)
  async createResource(@Args() resourceDto: ResourceDto) {
    return this.resourceService.create(resourceDto);
  }

  @Query(() => [Resource])
  @Roles(roles.ADMIN)
  getResources(@Args('perpage') perpage: number,@Args('currentpage') currentpage: number) {
    return this.resourceService.getResources(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countResources() {
    return this.resourceService.countResources();
  }
}
