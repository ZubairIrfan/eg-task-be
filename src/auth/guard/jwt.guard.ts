import { ExecutionContext, Injectable, Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);
  constructor() {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, user) {
    if (!user) return null;

    if (error) {
      this.logger.error(error);
      throw error;
    }
    return user;
  }
}
