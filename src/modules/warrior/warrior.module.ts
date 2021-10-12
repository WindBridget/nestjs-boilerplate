import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { WarriorRepository } from './warrior.repository';
import { WarriorResolver } from './warrior.resolver';
import { WarriorService } from './warrior.service';
import { WarriorExternalService } from './warriror.external.service';
import { Warrior } from './schemas/warrior.schema';
import { GameConfigModule } from 'modules/gameConfig/gameConfig.module';
import { UserWarriorModule } from 'modules/userWarrior/userWarrior.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypegooseModule.forFeature([Warrior]),
    GameConfigModule,
    HttpModule,
    forwardRef(() => UserWarriorModule),
  ],
  controllers: [],
  providers: [
    WarriorService,
    WarriorResolver,
    WarriorRepository,
    WarriorExternalService,
  ],
  exports: [WarriorService, WarriorRepository],
})
export class WarriorModule {}
