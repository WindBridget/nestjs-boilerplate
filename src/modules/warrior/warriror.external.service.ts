import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { WARRIOR } from 'common/constant/externalConstants';
import {
  EWarriorStatus,
  EWarriorSyncRate,
  EWarriorRarity,
} from 'common/constant/gameConstants';
import { IBaseExternalService } from 'common/service/base.external.service.interface';
import { getExternalPath, randomIntFromInterval } from 'common/util';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { map } from 'rxjs';
import { WarriorCreateDto } from './dtos/warriorCreate.dto';
import { WarriorRepository } from './warrior.repository';

@Injectable()
export class WarriorExternalService implements IBaseExternalService {
  private readonly logger = new BackendLogger(WarriorExternalService.name);
  path: string;

  constructor(
    private httpService: HttpService,
    private readonly warriorRepository: WarriorRepository,
  ) {
    this.path = getExternalPath(WARRIOR);
  }

  async getAllAndSave() {
    // console.log(this.path);
    // return this.httpService.get(this.path).pipe(
    //   map(async (response) => {
    //     const warriorTypes = await this.warriorRepository.getAllWarriorType();
    //     let dtos = [];
    //     warriorTypes.map((warriorType) => {
    //       const warriors = response.data.map((warrior) => {
    //         const data = {
    //           ...warrior,
    //           type: warriorType.type,
    //           status: EWarriorStatus.Released,
    //         };
    //         return new WarriorCreateDto(data);
    //       });
    //       console.log(warriors.length);
    //       dtos = dtos.concat(warriors);
    //     });
    //     console.log(dtos.length);
    //     return await this.warriorRepository.insertMany(dtos);
    //   }),
    // );
  }
}
