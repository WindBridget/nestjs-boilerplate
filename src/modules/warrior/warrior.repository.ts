import { Injectable } from '@nestjs/common';
import { EWarriorStatus, EWarriorRarity } from 'common/constant/gameConstants';
import { BaseRepository } from 'common/repository/base.repository';
import { Warrior } from 'modules/warrior/schemas/warrior.schema';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { WarriorCreateDto } from './dtos/warriorCreate.dto';

@Injectable()
export class WarriorRepository extends BaseRepository<Warrior> {
  constructor(
    @InjectModel(Warrior)
    private readonly warriorModel: ModelType<Warrior>,
  ) {
    super(warriorModel);
  }

  async create(warriorCreateDto: WarriorCreateDto): Promise<Warrior> {
    this.logger.log(`Creating new warrior: ${warriorCreateDto.head}`);
    const newWarrior = new this.warriorModel(warriorCreateDto);
    return await newWarrior.save();
  }

  async findDefault(): Promise<Warrior[]> {
    return await this.findAll({ status: EWarriorStatus.Test});
  }

  async findAllAndPaginateWarrior(perpage, currentpage): Promise<Warrior[]> {
    return await this.warriorModel.find().limit(perpage).skip(perpage * currentpage);
  }

  async countWarrior(): Promise<number> {
    return await this.warriorModel.estimatedDocumentCount();
  }

  async findRandom(
    quantity: number,
    rarity: string,
    status: string = EWarriorStatus.Draft,
  ): Promise<Warrior[]> {
    const warriors: Warrior[] = [];
    const filter =
      status === EWarriorStatus.Draft
        ? {
            rarity,
            status,
          }
        : {
            rarity,
            status,
          };
    for (let i = 0; i < quantity; i++) {
      const total = await this.warriorModel.countDocuments(filter);
      const random = Math.floor(Math.random() * total);
      console.log('findRandomPlayer', total, random);
      const warrior = await this.warriorModel.findOne(filter).skip(random);
      if (!warrior) {
        break;
      }
      // if (status === EWarriorStatus.Draft) {
      //   warrior.status = EWarriorStatus.Released;
      //   await this.warriorModel.updateOne(
      //     { _id: warrior._id },
      //     { status: EWarriorStatus.Released },
      //   );
      // }

      warriors.push(warrior);
    }
    return warriors;
  }

  // TODO: (nakhoa) temp uses remove it later
  public async getWeeklyWarriors(opts: any = {}): Promise<Warrior[]>  {
    return this.warriorModel.find().limit(5);
  }
}
