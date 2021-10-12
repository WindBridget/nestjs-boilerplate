import { SkillResolver } from './skill.resolver';
import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Skill } from './schemas/skill.schema';
import { UserWarriorSkill } from './schemas/userWarriorSkill.schema';
import { SkillRepository } from './skill.repository';
import { SkillService } from './skill.service';
import { UserResourceModule } from 'modules/userResource/userResource.module';
import { UserWarriorModule } from 'modules/userWarrior/userWarrior.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Skill, UserWarriorSkill]),
    UserResourceModule,
    forwardRef(() => UserWarriorModule),
  ],
  controllers: [],
  providers: [SkillResolver, SkillService, SkillRepository],
  exports: [SkillService, SkillRepository],
})
export class SkillModule { }
