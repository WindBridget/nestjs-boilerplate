import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserMeta } from './schemas/userMeta.schema';
import { UserMetaRepository } from './userMeta.repository';
import { UserMetaResolver } from './userMeta.resolver';
import { UserMetaService } from './userMeta.service';

@Module({
  imports: [TypegooseModule.forFeature([UserMeta])],
  controllers: [],
  providers: [UserMetaService, UserMetaResolver, UserMetaRepository],
  exports: [UserMetaService, UserMetaRepository],
})
export class UserMetaModule {}
