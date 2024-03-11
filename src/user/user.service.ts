import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { ApiSuccessResponse } from 'src/common/helpers/response';
import { UserMessages } from './messages';

@Injectable()
export class UserService {
  getUserData(user: User) {
    return ApiSuccessResponse(UserMessages.SUCCESS.GET_USER_DETAIL, user);
  }
}
