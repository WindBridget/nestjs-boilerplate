import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';
import WAValidator from 'wallet-address-validator';

@Scalar('WalletAddress')
export class WalletAddressScalar implements CustomScalar<string, string> {
  // tslint:disable-next-line:no-empty
  constructor() { }
  description: string;

  validateAddress(value) {
    return WAValidator.validate(value, 'ETH', 'BSC');
  }

  parseValue(value: string): string {
    if (typeof value !== 'string') {
      throw new TypeError('Value is not string');
    }

    if (!this.validateAddress(value)) {
      throw new TypeError(`Value is not a valid wallet address: ${value}`);
    }

    return value;
  }

  serialize(value: string): string {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not string: ${value}`);
    }

    if (!this.validateAddress(value)) {
      throw new TypeError(`Value is not a valid wallet address: ${value}`);
    }

    return value;
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as wallet address but got a: ${ast.kind}`,
      );
    }

    if (!this.validateAddress(ast.value)) {
      throw new TypeError(`Value is not a valid wallet address: ${ast.value}`);
    }
    return ast.value;
  }
}
