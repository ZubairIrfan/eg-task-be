import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorators/authentication.decorator';
import { CurrentUser } from 'src/auth/strategy/jwt.strategy';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Auth()
  getUserData(@CurrentUser() user: User) {
    return this.userService.getUserData(user);
  }
}
