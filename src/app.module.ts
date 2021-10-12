import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { EventHandlerModule } from 'eventHandler.module';
import { TypeGraphQLBuildSchemaOptions } from 'interfaces/ITypeGraphQLBuildSchemaOptions';
import _ from 'lodash';
import { AuthModule } from 'modules/auth/auth.module';
import { authChecker } from 'modules/auth/guards/typegraphqlAuthChecker';
import { BootstrapModule } from 'modules/bootstrap/bootstrap.module';
import { HealthController } from 'modules/health/health.controller';
import { WorkersModule } from 'modules/workers/workers.module';
import { ConsoleModule } from 'nestjs-console';
import { TypegooseModule } from 'nestjs-typegoose';
import { RootModule } from 'root.module';
import { MailModule } from './modules/mail/mail.module';
import { context } from 'common/util';

@Module({
  imports: [
    ConsoleModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      playground: true, // isDevEnv(),
      autoSchemaFile: 'schema.gql',
      context,
      installSubscriptionHandlers: true,
      buildSchemaOptions: { authChecker } as TypeGraphQLBuildSchemaOptions,
    }),
    TypegooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TerminusModule,
    AuthModule,
    BootstrapModule,
    RootModule,
    MailModule,
    WorkersModule,
    EventHandlerModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule { }
