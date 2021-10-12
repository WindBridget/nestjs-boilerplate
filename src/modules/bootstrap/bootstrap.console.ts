import { Console, Command } from 'nestjs-console';
import * as path from 'path';
import prompt from 'prompts';
import * as fs from 'fs';
import chalk from 'chalk';
import { moduleTemplate } from './templates/module.template';
import { controllerTemplate } from 'modules/bootstrap/templates/controller.template';
import { serviceTemplate } from 'modules/bootstrap/templates/service.template';
import { schemaTemplate } from 'modules/bootstrap/templates/schema.template';
import { resolverTemplate } from 'modules/bootstrap/templates/resolver.template';
import { dtoTemplate } from 'modules/bootstrap/templates/dto.template';
import { consoleTemplate } from 'modules/bootstrap/templates/console.template';
import { repositoryTemplate } from './templates/repository.template';

@Console({
  command: 'bootstrap',
  description: 'Create template files',
})
export class BootstrapConsole {
  @Command({
    command: 'module',
    description: 'Create template files that are in a typical module',
  })
  async bootstrapModule() {
    const { fileName } = await prompt({
      type: 'text',
      name: 'fileName',
      message:
        'File name to use (will also be used for variables). Should be camel-cased starting with a lowercase letter (for example "awesomeIcon")',
    });

    const className = fileName.charAt(0).toUpperCase() + fileName.slice(1);

    const { filesToCreate } = await prompt({
      type: 'multiselect',
      name: 'filesToCreate',
      message: 'Select files to create',
      choices: [
        { title: 'Controller', value: 'controller', selected: true },
        {
          title: 'Service',
          value: 'service',
          selected: true,
        },
        {
          title: 'Resolver',
          value: 'resolver',
          selected: true,
        },
        {
          title: 'Schema',
          value: 'schema',
          selected: true,
        },
        {
          title: 'DTO',
          value: 'dto',
          selected: true,
        },
        {
          title: 'Repository',
          value: 'repository',
          selected: true,
        },
        {
          title: 'Console',
          value: 'console',
          selected: false,
        },
      ],
    });

    // const baseDir = path.resolve(__dirname, '../../../src/modules', fileName);
    // console.log('Base dir:', chalk.blue(baseDir));

    // // Create the base dir
    // if (!fs.existsSync(baseDir)) {
    //   fs.mkdirSync(baseDir);
    // }

    ['module', ...filesToCreate].forEach((fileToCreate) => {
      let baseDir = '';
      if (fileToCreate === 'dto') {
        baseDir = path.resolve(
          __dirname,
          '../../../src/modules',
          fileName + '/dtos',
        );
      } else if (fileToCreate === 'schema') {
        baseDir = path.resolve(
          __dirname,
          '../../../src/modules',
          fileName + '/schemas',
        );
      } else {
        baseDir = path.resolve(__dirname, '../../../src/modules', fileName);
      }

      console.log('Base dir:', chalk.blue(baseDir));

      // Create the base dir
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
      }
      this.bootstrapFile(fileToCreate, fileName, className, baseDir);
    });

    console.log(
      `${chalk.red(
        'Dont forget!',
      )} Make sure to add the new module to app.module.ts if needed.`,
    );

    process.exit();
  }

  /**
   * Write the actual template file to disk.
   */
  bootstrapFile(
    type:
      | 'module'
      | 'controller'
      | 'service'
      | 'schema'
      | 'resolver'
      | 'dto'
      | 'console'
      | 'repository',
    name: string,
    className: string,
    baseDir: string,
  ) {
    console.log(`Setting up ${type}: ${name}`);

    let template;
    switch (type) {
      case 'module':
        template = moduleTemplate;
        break;
      case 'controller':
        template = controllerTemplate;
        break;
      case 'service':
        template = serviceTemplate;
        break;
      case 'schema':
        template = schemaTemplate;
        break;
      case 'resolver':
        template = resolverTemplate;
        break;
      case 'dto':
        template = dtoTemplate;
        break;
      case 'repository':
        template = repositoryTemplate;
        break;
      case 'console':
        template = consoleTemplate;
        break;
      default:
        console.log('Invalid bootstrap file type!');
        return;
    }

    const fileCode = template(name, className);

    // Write the code to disk
    fs.writeFileSync(path.resolve(baseDir, `${name}.${type}.ts`), fileCode);
  }
}
