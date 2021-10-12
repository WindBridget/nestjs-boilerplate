import { Injectable } from '@nestjs/common';
import { EResourceType } from 'common/constant/gameConstants';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { UserResourceItemDto } from './dtos/userResourceItemDto';
import {
  UserResourceListDto,
} from './dtos/userResourceListDto';
import { UserResourceReturnDto } from './dtos/userResourceReturn.dto';
import { UserResourceUpgradeDto } from './dtos/userResourceUpgradeDto';
import { UserResourceRepository } from './userResource.repository';
import _ from 'lodash';
import { totalmem } from 'os';

@Injectable()
export class UserResourceService {
  private readonly logger = new BackendLogger(UserResourceService.name);

  constructor(
    private readonly userResourceRepository: UserResourceRepository,
  ) {}

  async findOneById(id: string) {
    return await this.userResourceRepository.findOneById(id);
  }

  async findAll() {
    return await this.userResourceRepository.findAll();
  }

  async findByUserId(userId: string) {
    const userResources = await this.userResourceRepository.findAll({ userId });
    return userResources.map(
      (userResource) => new UserResourceReturnDto(userResource),
    );
  }

  async getUserResourceHeader(userId: string) {
    const userResources = await this.userResourceRepository.findAll({
      userId,
      'resource.type': {
        $in: [EResourceType.CURRENCY, EResourceType.RESOURCE],
      },
    });
    return userResources.map(
      (userResource) => new UserResourceReturnDto(userResource),
    );
  }

  async getUserResourcesByType(
    userId: string,
    type: string,
  ): Promise<UserResourceListDto> {
    const userResources = await this.userResourceRepository.findAll({
      userId,
      'resource.type': type,
      quantity: {
        $gt: 0,
      },
    });
    const resources = userResources.map(
      (userResource) => new UserResourceItemDto(userResource),
    );
    const firstResourceId = resources.length ? userResources[0]._id : '';
    const firstResource = firstResourceId
      ? await this.getResourceDetail(firstResourceId)
      : new UserResourceReturnDto();

    const data = {
      resources,
      firstResource,
    };
    return new UserResourceListDto(data);
  }

  async getResourceDetail(
    userResourceId: string,
  ): Promise<UserResourceReturnDto> {
    const userResource = await this.userResourceRepository.findOneById(
      userResourceId,
    );
    return new UserResourceReturnDto(userResource);
  }

  async getUserResourcesByTypeAndElement(
    userId: string,
    type: string,
    element: string,
  ): Promise<UserResourceUpgradeDto> {
    const userResources = await this.userResourceRepository.findAll({
      userId,
      'resource.type': type,
      'resource.element': element,
      quantity: {
        $gt: 0,
      },
    });
    const resources =  userResources.map(
      (userResource) => new UserResourceItemDto(userResource),
    );
    const totalCoin = _.sumBy(resources, 'totalCoin');
    return new UserResourceUpgradeDto({
      resources,
      totalCoin,
    });
  }
}
