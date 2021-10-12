export const resolverTemplate = (name: string, className: string) => {
  return `
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { GqlAuthGuard } from 'modules/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'modules/role/guards/graphqlRoles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { roles } from 'common/constant/constants';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { ${className}Service } from './${name}.service';
import { ${className} } from 'modules/${name}/schemas/${name}.schema';
import { ${className}Dto } from './dtos/${name}.dto';

@Resolver(${className})
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class ${className}Resolver {
  private readonly logger = new BackendLogger(${className}Resolver.name);

  constructor(private readonly ${name}Service: ${className}Service) {}

  @Query(() => ${className})
  async get${className}(@Args('id') id: string) {
    return this.${name}Service.findOneById(id);
  }

  @Mutation(() => ${className})
  @Roles(roles.ADMIN)
  async create${className}(@Args() create${className}Dto: ${className}Dto) {
    this.logger.log(\`Creating new ${name}\`);
    return await this.${name}Service.create(create${className}Dto);
  }
}

`;
};
