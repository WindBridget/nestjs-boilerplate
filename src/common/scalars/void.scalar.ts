import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('Void')
export class VoidScalar implements CustomScalar<string, string> {
  // tslint:disable-next-line:no-empty
  constructor() { }
  description: string = 'Represents NULL values';

  parseValue() {
    return null;
  }

  serialize() {
    return null;
  }

  parseLiteral() {
    return null;
  }
}
