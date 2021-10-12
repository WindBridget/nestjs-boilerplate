import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ResourceService } from './resource.service';
import { ResourceResolver } from './resource.resolver';
import { Resource } from './schemas/resource.schema';
import { ResourceRepository } from './resource.repository';

@Module({
  imports: [TypegooseModule.forFeature([Resource])],
  controllers: [],
  providers: [
    ResourceService,
    ResourceResolver,
    ResourceRepository,
  ],
  exports: [ResourceService, ResourceRepository],
})
export class ResourceModule {}
