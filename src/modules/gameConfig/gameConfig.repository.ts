import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { GameConfig } from 'modules/gameConfig/schemas/gameConfig.schema';
import { GameConfigDto } from './dtos/gameConfig.dto';
import { BaseRepository } from 'common/repository/base.repository';
import { Bundle } from './schemas/bundle.schema';

@Injectable()
export class GameConfigRepository extends BaseRepository<GameConfig> {
  constructor(
    @InjectModel(GameConfig) private readonly gameConnfigModel: ModelType<GameConfig>,
    @InjectModel(Bundle) private readonly bundleModel: ModelType<Bundle>,
  ) {
    super(gameConnfigModel);
  }

  async getConfigByKey(key: string): Promise<GameConfig> {
    return await this.gameConnfigModel.findOne({ key });
  }

  async findAllAndPaginateGameConfig(perpage, currentpage): Promise<GameConfig[]> {
    return await this.gameConnfigModel.find().limit(perpage).skip(perpage * currentpage);
  }

  async countGameConfig(): Promise<Number> {
    return await this.gameConnfigModel.estimatedDocumentCount({});
  }

  public async getAllBundle() {
    return await this.bundleModel.find().sort({ priority: 'asc' });
  }

  async getWarriorConfigByKey(key: string): Promise<string[]> {
    const warriorConfig = await this.gameConnfigModel.findOne({ key });
    const listConfig = warriorConfig.value.split('|');
    return listConfig;
  }

  async findOneAndUpdateBundle(filter: any = {}, update: any = {}): Promise<Bundle> {
    return await this.bundleModel.findOneAndUpdate(filter, update, { upsert: true, useFindAndModify: false, new: true});
  }


}
