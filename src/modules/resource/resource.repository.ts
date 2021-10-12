import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { Resource } from 'modules/resource/schemas/resource.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { ResourceDto } from './dtos/resource.dto';

@Injectable()
export class ResourceRepository extends BaseRepository<Resource> {

  constructor(
    @InjectModel(Resource) private readonly resourceModel: ModelType<Resource>,
  ) {
    super(resourceModel);
  }

  async findOneByCode(code: string) {
    return await this.resourceModel.findOne({ code });
  }

  async create(createResourceDto: ResourceDto): Promise<Resource> {
    const newResource = new this.resourceModel(createResourceDto);
    return await newResource.save();
  }

  async findAllAndPaginateResources(perpage, currentpage): Promise<Resource[]> {
    return await this.resourceModel.find().limit(perpage).skip(perpage * currentpage);
  }

  async countResources(): Promise<number> {
    return await this.resourceModel.estimatedDocumentCount();
  }
}
