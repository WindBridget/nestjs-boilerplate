
import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository } from 'common/repository/base.repository';
import { UserMeta, UserMetaModel } from 'modules/userMeta/schemas/userMeta.schema';
import { UserMetaDto } from './dtos/userMeta.dto';

@Injectable()
export class UserMetaRepository extends BaseRepository<UserMeta> {

  constructor(@InjectModel(UserMeta) private readonly userMetaModel: ModelType<UserMeta>) {
    super(userMetaModel);
  }

  async create(createUserMetaDto: UserMetaDto): Promise<UserMeta> {
    const newUserMeta = new this.userMetaModel(createUserMetaDto);
    return await newUserMeta.save();
  }
}
