export const moduleTemplate = (
  name: string,
  className: string,
  filesToCreate: string[],
) => {
  return `
  import { Module } from '@nestjs/common';
  import { TypegooseModule } from 'nestjs-typegoose';
  import { ${className}Service } from './${name}.service';
  import { ${className}Controller } from './${name}.controller';
  import { ${className}Resolver } from './${name}.resolver';
  import { ${className} } from './schemas/${name}.schema';
  import { ${className}Console } from './${name}.console';
  import { ${className}Repository } from './${name}.repository';

  @Module({
    imports: [
      TypegooseModule.forFeature([${className}]),
    ],
    controllers: [${className}Controller],
    providers: [${className}Service, ${className}Resolver, ${className}Console, ${className}Repository],
    exports: [${className}Service, ${className}Console, ${className}Repository],
  })
  export class ${className}Module {}

  `;
};
