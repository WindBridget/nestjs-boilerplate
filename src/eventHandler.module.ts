import { Module } from '@nestjs/common';
import { BootstrapEvent } from 'eventHandlers/bootstrap/bootstrap.event';
import { BootstrapListenner } from 'eventHandlers/bootstrap/bootstrap.listener';

@Module({
  controllers: [],
  providers: [BootstrapEvent, BootstrapListenner],
})
export class EventHandlerModule {}
