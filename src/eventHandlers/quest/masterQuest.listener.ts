import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EBootstrapEvent, EUserEvent } from 'common/constant/eventConstants';

@Injectable()
export class MasterQuestListenner {

  @OnEvent([EBootstrapEvent.SERVER_STARTED, EUserEvent.USER_QUEST_CREATED])
  onUserQuestCreated(payload: Record<string, any>) {
    Logger.log(`onUserQuestCreated ${payload.text}`);
  }
}
