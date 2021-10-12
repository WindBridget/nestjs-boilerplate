export const repositoryTemplate = (name: string, className: string) => {
  return `
import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository } from 'common/repository/base.repository';
import { ${className}, ${className}Model } from 'modules/${name}/schemas/${name}.schema';
import { ${className}Dto } from './dtos/${name}.dto';

@Injectable()
export class ${className}Repository extends BaseRepository<${className}> {

  constructor(@InjectModel(${className}) private readonly ${name}Model: ModelType<${className}>) {
    super(${name}Model);
  }

  async create(create${className}Dto: ${className}Dto): Promise<${className}> {
    const new${className} = new this.${name}Model(create${className}Dto);
    return await new${className}.save();
  }
}
`;
};
