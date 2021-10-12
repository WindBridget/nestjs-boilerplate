import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AuthenticationError } from 'apollo-server-errors';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;
      return new HttpException(
        message,
        status,
      );
    } else {
      if (exception instanceof AuthenticationError) {
        return new HttpException(
          'UNAUTHENTICATED!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return new HttpException(
        'INTERNAL_SERVER_ERROR!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // catch(exception: unknown, host: ArgumentsHost) {
  //   super.catch(exception, host);
  // }
}
