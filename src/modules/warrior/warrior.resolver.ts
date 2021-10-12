import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { roles } from 'common/constant/constants';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { Warrior } from 'modules/warrior/schemas/warrior.schema';
import { WarriorRandomCreateDto } from './dtos/warriorRandomCreate.dto';
import { WarriorUserCreateDto } from './dtos/warriorUserCreate.dto';
import { WarriorCreateDto } from './dtos/warriorCreate.dto';
import { WarriorService } from './warrior.service';
import { WarriorExternalService } from './warriror.external.service';
import { UserWarriorService } from '../userWarrior/userWarrior.service';
import { CurrentUser } from '../auth/guards/user.decorator';
import { User } from '../user/schemas/user.schema';
import { EUserWarriorStatus } from 'common/constant/gameConstants';

@Resolver(Warrior)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class WarriorResolver {
  private readonly logger = new BackendLogger(WarriorResolver.name);

  constructor(
    private readonly warriorService: WarriorService,
    private readonly warriorExternalService: WarriorExternalService,
    private readonly userWarriorService: UserWarriorService,
  ) { }

  @Query(() => Warrior, { name: 'warrior' })
  findOneById(@Args('id') id: string) {
    return this.warriorService.findOneById(id);
  }

  @Query(() => [Warrior])
  @Roles(roles.ADMIN)
  getWarriors(@Args('perpage') perpage: number, @Args('currentpage') currentpage: number) {
    return this.warriorService.getWarriors(perpage, currentpage);
  }

  @Query(() => Number)
  @Roles(roles.ADMIN)
  countWarriors() {
    return this.warriorService.countWarriors();
  }

  @Mutation(() => [Warrior])
  @Roles(roles.ADMIN)
  createRandomWarrior(@Args() warriorRandomCreateDto: WarriorRandomCreateDto) {
    return this.warriorService.createRandomWarrior(
      warriorRandomCreateDto.quantity,
      warriorRandomCreateDto.initRarity,
      warriorRandomCreateDto.initRole,
      warriorRandomCreateDto.initType,
    );
  }

  @Mutation(() => Warrior)
  @Roles(roles.USER)
  async createUserWarrior(
    @Args() warriorUserCreateDto: WarriorUserCreateDto,
    @CurrentUser() user: User,
  ) {
    const warrior = await this.warriorService.createWarrior(warriorUserCreateDto);
    await this.userWarriorService.createrWarrior(
      warrior,
      false,
      user._id,
      user.walletAddress,
      EUserWarriorStatus.PENDING,
    );
    return warrior;
  }
}
