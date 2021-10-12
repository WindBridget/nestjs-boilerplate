import { UserWarriorSkill } from './schemas/userWarriorSkill.schema';
import { UpgradeResourceDto } from 'modules/userWarrior/dtos/upgradeResource.dto';
import { UserWarriorSkillDto } from './dtos/userWarriorSkill.dto';
import { SkillService } from './skill.service';
import { BackendLogger } from './../logger/BackendLogger';
import { GqlRolesGuard } from './../role/guards/graphqlRoles.guard';
import { GqlAuthGuard } from './../auth/guards/graphqlAuth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Skill } from 'modules/skill/schemas/skill.schema';
import { SkillCreateDto } from './dtos/skill.dto';
import { CurrentUser } from 'modules/auth/guards/user.decorator';
import { User } from 'modules/user/schemas/user.schema';
import { UserWarriorSkillReturnDto } from './dtos/userWarriorSkillReturn.dto';

@Resolver(UserWarriorSkill)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class SkillResolver {
  private readonly logger = new BackendLogger(SkillResolver.name);
  constructor(
    private readonly skillService: SkillService,
  ) { }

  @Mutation(() => Skill)
  createSkill(@Args() skill: SkillCreateDto) {
    return this.skillService.createSkill(skill);
  }

  // @Mutation(() => Skill)
  // createUserWarriorSkill(@Args() userWarriorSkill: UserWarriorSkillDto) {
  //   return this.skillService.createUserWarriorSkill(userWarriorSkill);
  // }

  @Mutation(() => UserWarriorSkillReturnDto)
  upgradeSkill(
    @CurrentUser() user: User,
    @Args('userWarriorSkillId') userWarriorSkillId: string,
    @Args('totalCoin') totalCoin: number,
    @Args({
      name: 'upgradeResourceDtos',
      type: () => [UpgradeResourceDto],
    })
    upgradeResourceDtos: UpgradeResourceDto[],
  ) {
    return this.skillService.upgradeSkill(
      user._id,
      userWarriorSkillId,
      totalCoin,
      upgradeResourceDtos,
    );
  }

  @Query(() => UserWarriorSkillReturnDto)
  preUpgradeSkill(
    @CurrentUser() user: User,
    @Args('userWarriorSkillId') userWarriorSkillId: string,
    @Args({
      name: 'upgradeResourceDtos',
      type: () => [UpgradeResourceDto],
    })
    upgradeResourceDtos: UpgradeResourceDto[],
  ) {
    return this.skillService.getInfoPreUpgradeSkill(
      user._id,
      userWarriorSkillId,
      upgradeResourceDtos,
    );
  }
}
