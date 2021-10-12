import { BackendLogger } from 'modules/logger/BackendLogger';
import * as mongoose from 'mongoose';
import { ModelType, Typegoose } from 'typegoose';

export interface PaginateOptions {
  select?: string | {};
  sort?: string | {};
  populate?: string | {} | [];
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
}

export class BaseRepository<T extends Typegoose> {
  public logger: BackendLogger;
  constructor(private readonly model: ModelType<T>) {
    this.logger = new BackendLogger(model.name);
  }

  public async findOneById(id: string): Promise<T & mongoose.Document> {
    return await this.model.findById(id);
  }

  public async findOne(opts: any = {}): Promise<T & mongoose.Document> {
    return await this.model.findOne(opts);
  }

  public async findAll(opts: any = {}): Promise<T[] & mongoose.Document[]> {
    return await this.model.find(opts);
  }

  async findByIdAndUpdate(id: string, update: any = {}, isNew: boolean = true): Promise<T & mongoose.Document> {
    return await this.model.findByIdAndUpdate(id, update, { useFindAndModify: false, new: isNew });
  }

  async findOneAndUpdate(filter: any = {}, update: any = {}, isNew: boolean = true): Promise<T & mongoose.Document> {
    return await this.model.findOneAndUpdate(filter, update, { upsert: true, useFindAndModify: false, new: isNew });
  }

  public async deleteOne(opts: any = {}): Promise<void> {
    await this.model.deleteOne(opts);
  }

  public async count(opts: any = {}): Promise<number> {
    return await this.model.countDocuments(opts);
  }

  async insertMany(dtos: any[]): Promise<T[]> {
    const news = dtos.map(
      (dto) => new this.model(dto),
    );
    return await this.model.insertMany(news);
  }

  public async deleteMany(opts: any = {}): Promise<void> {
    await this.model.deleteMany(opts);
  }
}
