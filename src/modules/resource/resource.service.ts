import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Resource } from 'modules/resource/schemas/resource.schema';
import { ResourceDto } from './dtos/resource.dto';
import { ResourceRepository } from './resource.repository';

@Injectable()
export class ResourceService {
  private readonly logger = new BackendLogger(ResourceService.name);

  constructor(private readonly resourceRepository: ResourceRepository) {}

  async findAll() {
    return await this.resourceRepository.findAll();
  }

  async create(createResourceDto: ResourceDto): Promise<Resource> {
    return await this.resourceRepository.create(createResourceDto);
  }

  async getResources(perpage: number, currentPage: number) {
    return await this.resourceRepository.findAllAndPaginateResources(perpage, currentPage);
  }

  async countResources() {
    return await this.resourceRepository.countResources();
  }

}
