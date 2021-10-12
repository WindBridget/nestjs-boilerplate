import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { RewardResourceItemDto } from 'modules/rewardResource/dtos/rewardResourceItem.dto';
import { UserResource } from 'modules/userResource/schemas/userResource.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { UserResourceDto } from './dtos/userResource.dto';

@Injectable()
export class UserResourceRepository extends BaseRepository<UserResource> {
  constructor(
    @InjectModel(UserResource)
    private readonly userResourceModel: ModelType<UserResource>,
  ) {
    super(userResourceModel);
  }

  async create(createUserResourceDto: UserResourceDto): Promise<UserResource> {
    const newUserResource = new this.userResourceModel(createUserResourceDto);
    return await newUserResource.save();
  }

  async findByUserId(userId: string) {
    return await this.userResourceModel.find({ userId });
  }

  async applyResourceByCodeAndValue(
    userId: string,
    code: string,
    value: number,
  ): Promise<UserResource> {
    const userResource = await this.findOne({
      userId,
      'resource.code': code,
    });
    if (userResource.quantity + value < 0) {
      throw new Error(`Not enough resource ' ${code}`);
    }
    userResource.quantity += value;
    return await userResource.save();
  }

  async applyResource(userId: string, resource: RewardResourceItemDto) {
    console.log('applyResource', userId, resource.code, resource.value);
    const filter = { userId, 'resource.code': resource.code };
    const update = {
      'resource.name': resource.name,
      'resource.type': resource.type,
      'resource.element': resource.element,
      'resource.exp': resource.exp,
      'resource.coinCost': resource.coinCost,
      $inc: {
        quantity: resource.value,
      },
    };
    return await this.userResourceModel.findOneAndUpdate(filter, update, {
      upsert: true,
      useFindAndModify: false,
      new: true,
    });
  }
}
