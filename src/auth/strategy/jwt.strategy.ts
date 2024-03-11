import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  createParamDecorator,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IValidateUser } from '../interfaces/validate-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: IValidateUser) {
    try {
      const user = await this.authService.validateUser(payload);
      const { hash, ...userFilteredData } = user;

      return userFilteredData;
    } catch (error) {
      this.logger.error(error);
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      return null;
    }
    return data ? user[data] : user;
  },
);
