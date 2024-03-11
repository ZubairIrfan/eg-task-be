import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { IValidateUser } from './interfaces/validate-user.interface';
import { AuthMessages } from './messages';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword, isValidPassword } from 'src/common/helpers/bcrypt';
import { ApiSuccessResponse } from 'src/common/helpers/response';
import { JwtService } from '@nestjs/jwt';
import { IUserTokenData } from 'src/user/interfaces/user-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const userData = await this.UserModel.findOne({
      email: loginDto.email,
    }).lean();
    if (!userData) {
      throw new BadRequestException(AuthMessages.ERROR.USER_NOT_FOUND);
    }
    const { hash, ...userFilteredData } = userData;
    const isPasswordMatched = await isValidPassword(hash, loginDto.password);
    if (!isPasswordMatched) {
      throw new BadRequestException(AuthMessages.ERROR.INVALID_PASSWORD);
    }

    const authToken = this.generateTokens(userFilteredData);

    return ApiSuccessResponse(AuthMessages.SUCCESS.LOGIN, {
      ...userFilteredData,
      token: authToken,
    });
  }

  async signup(signupDto: SignupDto) {
    const isEmailAlreadyExists = await this.UserModel.findOne({
      email: signupDto.email,
    });
    if (isEmailAlreadyExists) {
      throw new BadRequestException(
        AuthMessages.ERROR.EMAIL_ALREADY_REGISTERED,
      );
    }
    const { password, ...userFilteredData } = signupDto;
    const hashedPassword = await hashPassword(password);
    const createdUser = await this.UserModel.create({
      email: signupDto.email,
      name: signupDto.name,
      hash: hashedPassword,
    });
    const authToken = this.generateTokens(userFilteredData);
    return ApiSuccessResponse(AuthMessages.SUCCESS.SIGNUP, {
      ...userFilteredData,
      _id: createdUser._id.toString(),
      token: authToken,
    });
  }

  async validateUser(payload: IValidateUser) {
    try {
      const user = await this.UserModel.findOne({
        email: payload.email,
      }).lean();

      if (!user) {
        throw new NotFoundException(AuthMessages.ERROR.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  generateTokens(userData: IUserTokenData) {
    const accessToken: string = this.jwtService.sign(userData, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    return accessToken;
  }
}
