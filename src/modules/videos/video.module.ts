import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { VideoResolver } from './video.resolver';
import { Video } from './schemas/video.schema';
import { RewardModule } from 'modules/reward/reward.module';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [TypegooseModule.forFeature([Video]), RewardModule, UserModule],
  controllers: [],
  providers: [VideoResolver],
  exports: [],
})
export class VideoModule {}
