import { Injectable } from '@nestjs/common';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { User } from 'modules/user/schemas/user.schema';
import { InfoReturnDto } from './dtos/InfoReturn.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new BackendLogger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findOne(opts: any = {}) {
    return await this.userRepository.findOne(opts);
  }

  async findOneById(id: string) {
    return await this.userRepository.findOneById(id);
  }

  async findAll(opts: any = {}) {
    return await this.userRepository.findAll(opts);
  }

  async getAllUserByAdmin(perpage: number, currentPage: number) {
    return await this.userRepository.findAllAndPaginateAllUser(
      perpage,
      currentPage,
    );
  }

  async countUsers() {
    return await this.userRepository.countUsers();
  }

  async getInfo(userId: string): Promise<InfoReturnDto> {
    const user = await this.userRepository.findOneById(userId);
    return new InfoReturnDto(user);
  }

  async findByIdAndUpdate(id: string, update: any): Promise<User> {
    return await this.userRepository.findByIdAndUpdate(id, update);
  }

  async findOneAndUpdate(filter: any, update: any): Promise<User> {
    return await this.userRepository.findOneAndUpdate(filter, update);
  }

  async addRole(userId: string, roleName: string) {
    return await this.userRepository.addRole(userId, roleName);
  }

  async disableRole(userId: string, roleName: string) {
    return await this.userRepository.disableRole(userId, roleName);
  }
}
