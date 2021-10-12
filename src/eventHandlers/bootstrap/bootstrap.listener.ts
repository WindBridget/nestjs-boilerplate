import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EBootstrapEvent } from 'common/constant/eventConstants';

@Injectable()
export class BootstrapListenner {
  public eventPayload = {};

  @OnEvent(EBootstrapEvent.SERVER_STARTED)
  onServerStart(payload: Record<string, any>) {
    Logger.log(`onServerStart ${payload.text}`);
    this.eventPayload = payload;
  }
}
