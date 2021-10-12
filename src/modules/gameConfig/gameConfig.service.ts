import { Injectable } from '@nestjs/common';
import { GameConfig } from 'modules/gameConfig/schemas/gameConfig.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GameConfigRepository } from './gameConfig.repository';
import { GameConfigDto } from './dtos/gameConfig.dto';
import { BundleVersionDto } from './dtos/bundleVersion.dto';
import { BUNDLE_URL, BUNDLE_VERSION } from 'common/constant/configConstants';
import { Bundle } from './schemas/bundle.schema';
import { BundleDto } from './dtos/bundle.dto';

@Injectable()
export class GameConfigService {
  private readonly logger = new BackendLogger(GameConfigService.name);

  constructor(private readonly configRepository: GameConfigRepository) {}

  async findOneById(id: string) {
    return await this.configRepository.findOneById(id);
  }

  async findAll() {
    return await this.configRepository.findAll();
  }

  async findAllAndPaginateGameConfig(perpage: number, currentpage: number) {
    return await this.configRepository.findAllAndPaginateGameConfig(perpage, currentpage);
  }

  async countGameConfig() {
    return await this.configRepository.countGameConfig();
  }

  async findOneAndUpdate(createConfigDto: GameConfigDto): Promise<GameConfig> {
    const filter = { key: createConfigDto.key };
    const update = {
      value: createConfigDto.value,
      description: createConfigDto.description,
    };
    return await this.configRepository.findOneAndUpdate(filter, update);
  }

  async findOneAndUpdateBundle(bundleDto: BundleDto): Promise<Bundle> {
    const filter = { name: bundleDto.name };
    const update = {
      name: bundleDto.name,
      priority: bundleDto.priority,
    };
    return await this.configRepository.findOneAndUpdateBundle(filter, update);
  }

  async getConfigByKey(key: string) {
    return await this.configRepository.getConfigByKey(key);
  }

  async getBundleVersion() {
    const bundleVersion = await this.getConfigByKey(BUNDLE_VERSION);
    const bundleUrl = await this.getConfigByKey(BUNDLE_URL);
    const bundlesPriority = await this.configRepository.getAllBundle();
    const data = {
      bundleVersion,
      bundlesPriority,
      bundleUrl,
    };
    return new BundleVersionDto(data);
  }
}
