import { forwardRef, Module } from '@nestjs/common';
import { SkillModule } from 'modules/skill/skill.module';
import { UserModule } from 'modules/user/user.module';
import { UserResourceModule } from 'modules/userResource/userResource.module';
import { WarriorModule } from 'modules/warrior/warrior.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserWarrior } from './schemas/userWarrior.schema';
import { UserWarriorRepository } from './userWarrior.repository';
import { UserWarriorResolver } from './userWarrior.resolver';
import { UserWarriorService } from './userWarrior.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypegooseModule.forFeature([UserWarrior]),
    UserResourceModule,
    SkillModule,
    forwardRef(() => OrderModule),
    forwardRef(() => UserModule),
    forwardRef(() => WarriorModule),
    forwardRef(() => SkillModule),
    forwardRef(() => SkillModule),
    // WarriorModule,
  ],
  controllers: [],
  providers: [UserWarriorService, UserWarriorResolver, UserWarriorRepository],
  exports: [UserWarriorService, UserWarriorRepository],
})
export class UserWarriorModule {}
