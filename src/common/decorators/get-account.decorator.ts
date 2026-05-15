import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccount = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const account = request.user;
    return data ? account?.[data] : account;
  },
);
