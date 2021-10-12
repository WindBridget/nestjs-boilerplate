export const serviceTemplate = (name: string, className: string) => {
  return `
import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { ${className}, ${className}Model } from 'modules/${name}/schemas/${name}.schema';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { ${className}Dto } from './dtos/${name}.dto';
import { ${className}Repository } from './${name}.repository';

@Injectable()
export class ${className}Service {
  private readonly logger = new BackendLogger(${className}Service.name);

  constructor(private readonly ${name}Repository: ${className}Repository) {}

  async findOneById(id: string) {
    return await this.${name}Repository.findOneById(id);
  }

  async findAll(opts: any = {}) {
    return await this.${name}Repository.findAll(opts);
  }

  async create(create${className}Dto: ${className}Dto): Promise<${className}> {
    return await this.${name}Repository.create(create${className}Dto);
  }
}
`;
};
