import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'modules/user/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.user;
  },
);
