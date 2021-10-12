import { Injectable } from '@nestjs/common';
import { EUserWarriorStatus } from 'common/constant/gameConstants';
import { BaseRepository } from 'common/repository/base.repository';
import { UserWarrior } from 'modules/userWarrior/schemas/userWarrior.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { UserWarriorCreateDto } from './dtos/userWarriorCreate.dto';

@Injectable()
export class UserWarriorRepository extends BaseRepository<UserWarrior> {
  constructor(
    @InjectModel(UserWarrior)
    private readonly userWarriorModel: ModelType<UserWarrior>,
  ) {
    super(userWarriorModel);
  }

  async create(
    userWarriorCreateDto: UserWarriorCreateDto,
  ): Promise<UserWarrior> {
    const newUserWarrior = new this.userWarriorModel(userWarriorCreateDto);
    return await newUserWarrior.save();
  }

  async update(
    userWarrior: UserWarrior,
  ): Promise<UserWarrior> {
    return await this.userWarriorModel.findByIdAndUpdate(
      userWarrior._id,
      userWarrior,
    );
  }

  async findByUserId(userId: string): Promise<UserWarrior[]> {
    return await this.userWarriorModel.find({ userId }).limit(3);
  }

  async findAllForWeb(
    sortBy: string,
    orderBy: string,
    page: number,
    limit: number,
    filter: any = {},
  ): Promise<UserWarrior[]> {
    return this.userWarriorModel
      .find(filter)
      .sort([
        [sortBy, orderBy],
        ['_id', 'asc'],
      ])
      .limit(limit)
      .skip(limit * page);
  }

  async getListUserWarriors(
    userId: string,
    sortBy: string,
    // page: number,
    // limit: number,
  ): Promise<UserWarrior[]> {
    if (sortBy === 'rarity') {
      return await this.userWarriorModel
        .find({
          userId,
          status: {
            $ne: EUserWarriorStatus.IN_MARKET,
          },
        })
        .sort([
          ['warrior.rareOrder', 1],
          ['warrior.name', 1],
        ]);
    }
    if (sortBy === 'level' || sortBy === 'all') {
      return await this.userWarriorModel
        .find({
          userId,
          status: {
            $ne: EUserWarriorStatus.IN_MARKET,
          },
        })
        .sort([
          [sortBy, -1],
          ['warrior.name', 1],
        ]);
    }
    return await this.userWarriorModel
      .find({
        'warrior.type': sortBy.toUpperCase(),
        userId,
        status: {
          $ne: EUserWarriorStatus.IN_MARKET,
        },
      })
      .sort([
        ['warrior.name', 1],
      ]);
    // .limit(limit)
    // .skip(limit * page);
  }
  async resetHealth() {
    await this.userWarriorModel.updateMany({}, { health: 1000, mana: 100 });
  }

  async applyAttributeRate(userWarriorId: string, attributeRate: number) {
    console.log('applyAttributeRate', userWarriorId, attributeRate);
    return await this.userWarriorModel.findByIdAndUpdate(
      userWarriorId,
      {
        $inc: {
          atkRate: attributeRate,
          defRate: attributeRate,
          staRate: attributeRate,
          accRate: attributeRate,
        },
      },
      { new: true },
    );
  }
}
