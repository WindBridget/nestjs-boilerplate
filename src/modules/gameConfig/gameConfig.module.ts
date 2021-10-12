import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { GameConfigRepository } from './gameConfig.repository';
import { GameConfigResolver } from './gameConfig.resolver';
import { GameConfigService } from './gameConfig.service';
import { Bundle } from './schemas/bundle.schema';
import { GameConfig } from './schemas/gameConfig.schema';

@Module({
  imports: [TypegooseModule.forFeature([GameConfig, Bundle])],
  controllers: [],
  providers: [GameConfigService, GameConfigResolver, GameConfigRepository],
  exports: [GameConfigService, GameConfigRepository],
})
export class GameConfigModule {}
