import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EBootstrapEvent } from 'common/constant/eventConstants';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class BootstrapEvent implements OnApplicationBootstrap {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  onApplicationBootstrap() {
    this.eventEmitter.emit(EBootstrapEvent.SERVER_STARTED, { text: 'server start!!!' });
  }
}
