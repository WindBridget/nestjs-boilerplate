import { UserWarriorSkillDto } from './dtos/userWarriorSkill.dto';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'common/repository/base.repository';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { SkillCreateDto } from './dtos/skill.dto';
import { Skill } from './schemas/skill.schema';
import { UserWarriorSkill } from './schemas/userWarriorSkill.schema';
import { EResourceElement } from 'common/constant/gameConstants';

@Injectable()
export class SkillRepository extends BaseRepository<UserWarriorSkill> {
  constructor(
    @InjectModel(Skill) private readonly skillModel: ModelType<Skill>,
    @InjectModel(UserWarriorSkill) private readonly userWarriorSkillModel: ModelType<UserWarriorSkill>,
  ) {
    super(userWarriorSkillModel);
  }

  async createSkill(
    userWarriorCreateDto: SkillCreateDto,
  ): Promise<Skill> {
    const newSkill = new this.skillModel(userWarriorCreateDto);
    return await newSkill.save();
  }

  async getSkill(
    type: string,
    element: string,
    range: number,
  ): Promise<Skill> {
    return await this.skillModel.findOne({ type, element, range });
  }

  async createUserWarriorSkill(
    createUserWarriorSkill: UserWarriorSkillDto,
  ): Promise<UserWarriorSkill> {
    const newUserWarriorSkill = new this.userWarriorSkillModel(createUserWarriorSkill);
    return await newUserWarriorSkill.save();

  }

  async updateUserWarriorSkill(
    userWarriorSkill: UserWarriorSkill,
  ): Promise<UserWarriorSkill> {
    return await this.userWarriorSkillModel.findByIdAndUpdate(
      userWarriorSkill._id,
      userWarriorSkill,
    );
  }

  // async findByUserId(userId: string): Promise<UserWarrior[]> {
  //   return await this.userWarriorModel.find({ userId }).limit(3);
  // }

  // async findAllForWeb(
  //   sortBy: string,
  //   orderBy: string,
  //   page: number,
  //   limit: number,
  //   filter: any = {},
  // ): Promise<UserWarrior[]> {
  //   return await this.userWarriorModel
  //     .find(filter)
  //     .sort([
  //       [sortBy, orderBy],
  //       ['_id', 'asc'],
  //     ])
  //     .limit(limit)
  //     .skip(limit * page);
  // }

  // async getListUserWarriors(
  //   userId: string,
  //   sortBy: string,
  //   // page: number,
  //   // limit: number,
  // ): Promise<UserWarrior[]> {
  //   if (sortBy === 'rarity') {
  //     return await this.userWarriorModel
  //       .find({
  //         userId,
  //         status: {
  //           $ne: EUserWarriorStatus.IN_MARKET,
  //         },
  //       })
  //       .sort([
  //         ['warrior.rarity', -1],
  //         ['warrior.name', 1],
  //       ]);
  //   }
  //   if (sortBy === 'level' || sortBy === 'all') {
  //     return await this.userWarriorModel
  //       .find({
  //         userId,
  //         status: {
  //           $ne: EUserWarriorStatus.IN_MARKET,
  //         },
  //       })
  //       .sort([
  //         [sortBy, -1],
  //         ['warrior.name', 1],
  //       ]);
  //   }
  //   return await this.userWarriorModel
  //     .find({
  //       'warrior.type': sortBy.toUpperCase(),
  //       userId,
  //       status: {
  //         $ne: EUserWarriorStatus.IN_MARKET,
  //       },
  //     })
  //     .sort([
  //       ['warrior.name', 1],
  //     ]);
  //   // .limit(limit)
  //   // .skip(limit * page);
  // }
  // async resetHealth() {
  //   await this.userWarriorModel.updateMany({}, { health: 1000, mana: 100 });
  // }

  // async applyAttributeRate(userWarriorId: string, attributeRate: number) {
  //   console.log('applyAttributeRate', userWarriorId, attributeRate);
  //   return await this.userWarriorModel.findByIdAndUpdate(
  //     userWarriorId,
  //     {
  //       $inc: {
  //         atkRate: attributeRate,
  //         defRate: attributeRate,
  //         staRate: attributeRate,
  //         accRate: attributeRate,
  //       },
  //     },
  //     { new: true },
  //   );
  // }
}
