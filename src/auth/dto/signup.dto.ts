import { IsEmail, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/constants';

export class SignupDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and must be between 8 and 16 characters long.',
  })
  password: string;
}
