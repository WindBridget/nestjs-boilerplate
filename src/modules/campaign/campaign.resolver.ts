import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { Campaign } from 'modules/campaign/schemas/campaign.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { User } from 'modules/user/schemas/user.schema';
import { CampaignService } from './campaign.service';
import { CampaignDto } from './dtos/campaign.dto';
import { CampaignInfoDto } from './dtos/campaignInfo.dto';

@Resolver(Campaign)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class CampaignResolver {
  private readonly logger = new BackendLogger(CampaignResolver.name);

  constructor(private readonly campaignService: CampaignService) {}

  @Query(() => Campaign)
  async campaign(@Args('id') id: string) {
    return this.campaignService.findOneById(id);
  }

  @Mutation(() => Campaign)
  @Roles(roles.ADMIN)
  async createCampaign(@Args() createCampaignDto: CampaignDto) {
    this.logger.log(`Creating new campaign`);
    return await this.campaignService.create(createCampaignDto);
  }

  @Query(() => CampaignInfoDto)
  async getCampaignInfo(@CurrentUser() user: User) {
    return this.campaignService.getCampaignInfo(
      user.campaignStage,
      user.team,
      user.energy,
    );
  }

  @Query(() => [Campaign])
  @Roles(roles.ADMIN)
  async getCampaigns(
    @Args('perpage') perpage: number,
    @Args('currentpage') currentpage: number,
  ) {
    return this.campaignService.findAllAndPaginateCapaign(perpage, currentpage);
  }
  @Query(() => Number)
  @Roles(roles.ADMIN)
  async countCapaign() {
    return this.campaignService.countCampaign();
  }
}
