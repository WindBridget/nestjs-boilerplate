import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionFilter } from 'errorHandlers/exception.filter';

require('source-map-support').install();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.enableCors();
  await app.listen(process.env.PORT || 5555);
  Logger.log(`Listening member server ${process.env.MASTER_PORT} on http://localhost:${process.env.PORT}`, 'startServer');
}

bootstrap();
