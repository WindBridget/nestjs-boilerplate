import { HttpException, HttpStatus } from '@nestjs/common';

export class UnAuthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
