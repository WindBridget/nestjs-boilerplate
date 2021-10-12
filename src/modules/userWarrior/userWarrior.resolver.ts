import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { SkillService } from 'modules/skill/skill.service';
import { User } from 'modules/user/schemas/user.schema';
import { UserWarrior } from 'modules/userWarrior/schemas/userWarrior.schema';
import { BuyItemDto } from './dtos/buy-item.dto';
import { CreateItemDto } from './dtos/create-item.dto';
import { MintItemDto } from './dtos/mint-item.dto';
import { UpgradeResourceDto } from './dtos/upgradeResource.dto';
import { UserListWarriorDto } from './dtos/userListWarrior.dto';
import { UserWarriorItemDto } from './dtos/userWarriorItem.dto';
import { UserWarriorService } from './userWarrior.service';

@Resolver(UserWarrior)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class UserWarriorResolver {
  private readonly logger = new BackendLogger(UserWarriorResolver.name);

  constructor(
    private readonly userWarriorService: UserWarriorService,
    private readonly skillService: SkillService,
  ) { }

  // @Query(() => UserWarriorItemDto)
  // async getWarriorDetail(@Args('userWarriorId') userWarriorId: string) {
  //   return this.userWarriorService.getWarriorDetail(userWarriorId);
  // }

  // @Query(() => [UserWarriorItemDto])
  // async getWarriorsForWeb(
  //   @Args() userWarriorRequestDto: UserWarriorRequestDto,
  // ) {
  //   return this.userWarriorService.getWarriorsForWeb(
  //     userWarriorRequestDto.sortBy,
  //     userWarriorRequestDto.orderBy,
  //     userWarriorRequestDto.page,
  //     userWarriorRequestDto.limit,
  //     userWarriorRequestDto.type,
  //     userWarriorRequestDto.element,
  //     userWarriorRequestDto.rarity,
  //     userWarriorRequestDto.role,
  //   );
  // }

  @Query(() => UserListWarriorDto)
  async getListUserWarriors(
    @CurrentUser() user: User,
    @Args('sortBy') sortBy: string,
    // @Args('page') page: number,
    // @Args('limit') limit: number,
  ) {
    return await this.userWarriorService.getListUserWarriors(
      user._id,
      sortBy,
      // page,
      // limit,
    );
  }

  @Mutation(() => [UserWarrior])
  @Roles(roles.ADMIN)
  generateWarriorForUser(@Args('userId') userId: string) {
    return this.userWarriorService.generateDefaultWarriorForUser(userId);
  }

  @Mutation(() => [UserWarrior])
  @Roles(roles.ADMIN)
  generateWarriorForUserTest(
    @Args('userId') userId: string,
    @Args('quantity') quantity: number,
  ) {
    return this.userWarriorService.generateWarriorForUserTest(userId, quantity);
  }

  @Mutation(() => [UserWarrior])
  @Roles(roles.ADMIN)
  generateWarrior(
    @Args('quantity') quantity: number,
    @Args('rarity') rarity: string,
  ) {
    return this.userWarriorService.generateWarrior(quantity, rarity);
  }

  @Query(() => UserWarriorItemDto)
  preUpgradeWarrior(
    @CurrentUser() user: User,
    @Args('userWarriorId') userWarriorId: string,
    @Args({
      name: 'upgradeResourceDtos',
      type: () => [UpgradeResourceDto],
    })
    upgradeResourceDtos: UpgradeResourceDto[],
  ) {
    return this.userWarriorService.getInfoPreUpgradeWarrior(
      user._id,
      userWarriorId,
      upgradeResourceDtos,
    );
  }

  @Mutation(() => UserWarriorItemDto)
  upgradeWarrior(
    @CurrentUser() user: User,
    @Args('userWarriorId') userWarriorId: string,
    @Args('totalCoin') totalCoin: number,
    @Args({
      name: 'upgradeResourceDtos',
      type: () => [UpgradeResourceDto],
    })
    upgradeResourceDtos: UpgradeResourceDto[],
  ) {
    return this.userWarriorService.upgradeWarrior(
      user._id,
      userWarriorId,
      totalCoin,
      upgradeResourceDtos,
    );
  }

  // ----- for nft -----
  @Mutation(() => [MintItemDto])
  @Roles(roles.ADMIN)
  sellAll(
    @CurrentUser() user: User,
  ) {
    try {
      return this.userWarriorService.sellAll(user._id);
    } catch (error) {
      throw new HttpException(
        `Request mint signature error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => MintItemDto)
  requestMintSignature(
    @Args('nftToken') nftToken: number,
    @Args('price') price: number,
  ) {
    try {
      return this.userWarriorService.requestMintSignature(nftToken, price);
    } catch (error) {
      throw new HttpException(
        `Request mint signature error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => BuyItemDto)
  requestBuyAsset(
    @CurrentUser() user: User,
    @Args('nftToken') nftToken: number,
  ) {
    try {
      return this.userWarriorService.requestBuyAsset(nftToken, user._id);
    } catch (error) {
      throw new HttpException(
        `Request buy warrior error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => UserWarriorItemDto)
  updateNftCreate(
    @Args('nftToken') nftToken: number,
    @Args() createItemDtos: CreateItemDto,
  ) {
    try {
      return this.userWarriorService.updateNftCreate(nftToken, createItemDtos);
    } catch (error) {
      throw new HttpException(
        `Request create nft warrior error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Mutation(() => UserWarriorItemDto)
  updateNftOwner(
    @Args('nftToken') nftToken: number,
    @Args('userId') userId: string,
    @Args('walletAddress') walletAddress: string,
  ) {
    try {
      return this.userWarriorService.updateNftOwner(
        nftToken,
        userId,
        walletAddress,
      );
    } catch (error) {
      throw new HttpException(
        `Request update owner warrior error: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('ADMIN')
  @Mutation(() => Boolean)
  resetHealth() {
    return this.userWarriorService.resetHealth();
  }

  // @Mutation(() => Boolean)
  // xxx() {
  //   return this.userWarriorService.xxx();
  // }
}
