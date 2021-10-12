import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { UserMeta } from 'modules/userMeta/schemas/userMeta.schema';
import { UserMetaDto } from './dtos/userMeta.dto';
import { UserMetaRepository } from './userMeta.repository';

@Injectable()
export class UserMetaService {
  private readonly logger = new BackendLogger(UserMetaService.name);

  constructor(private readonly userMetaRepository: UserMetaRepository) {}

  async findOneById(id: string) {
    return await this.userMetaRepository.findOneById(id);
  }

  async findAll(opts: any = {}) {
    return await this.userMetaRepository.findAll(opts);
  }

  async create(createUserMetaDto: UserMetaDto): Promise<UserMeta> {
    return await this.userMetaRepository.create(createUserMetaDto);
  }

  async findOneByUserId(userId: string): Promise<UserMeta> {
    const data = await this.userMetaRepository.findOne({ userId });
    return data;
  }

  async findOneAndUpdateLoginByUserId(userId: string) {
    const filter = { userId };
    const update = {
      hasLoginToday: true,
      lastLoginAt: Date.now(),
    };
    await this.userMetaRepository.findOneAndUpdate(filter, update);
  }
}
