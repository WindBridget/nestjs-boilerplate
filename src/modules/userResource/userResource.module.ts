import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserResourceService } from './userResource.service';
import { UserResourceResolver } from './userResource.resolver';
import { UserResource } from './schemas/userResource.schema';
import { UserResourceRepository } from './userResource.repository';

@Module({
  imports: [TypegooseModule.forFeature([UserResource])],
  controllers: [],
  providers: [
    UserResourceService,
    UserResourceResolver,
    UserResourceRepository,
  ],
  exports: [UserResourceService, UserResourceRepository],
})
export class UserResourceModule {}
