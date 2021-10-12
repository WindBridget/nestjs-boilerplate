import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { GameConfig } from 'modules/gameConfig/schemas/gameConfig.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { GameConfigService } from './gameConfig.service';
import { GameConfigDto } from './dtos/gameConfig.dto';
import { BundleVersionDto } from './dtos/bundleVersion.dto';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { User } from 'modules/user/schemas/user.schema';
import { BundleDto } from './dtos/bundle.dto';
import { Bundle } from './schemas/bundle.schema';

@Resolver(GameConfig)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class GameConfigResolver {
  private readonly logger = new BackendLogger(GameConfigResolver.name);

  constructor(private readonly configService: GameConfigService) {}

  @Query(() => GameConfig)
  async config(@Args('id') id: string) {
    return this.configService.findOneById(id);
  }

  @Mutation(() => GameConfig)
  @Roles(roles.ADMIN)
  async createConfig(@Args() createConfigDto: GameConfigDto) {
    this.logger.log(`Creating new config`);
    return await this.configService.findOneAndUpdate(createConfigDto);
  }

  @Mutation(() => Bundle)
  @Roles(roles.ADMIN)
  async createBundle(@Args() createBundleDto: BundleDto) {
    this.logger.log(`Creating new config`);
    return await this.configService.findOneAndUpdateBundle(createBundleDto);
  }

  @Query(() => GameConfig)
  async getConfigByKey(@Args('key') key: string) {
    return this.configService.getConfigByKey(key);
  }

  @Query(() => [GameConfig])
  @Roles(roles.ADMIN)
  async getAllGameConfig(@Args('perpage') perpage: number,@Args('currentpage') currentpage: number) {
    return this.configService.findAllAndPaginateGameConfig(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  async countGameConfig() {
    return this.configService.countGameConfig();
  }

  @Query(() => BundleVersionDto)
  async getBundleVersion() {
    return this.configService.getBundleVersion();
  }
}
