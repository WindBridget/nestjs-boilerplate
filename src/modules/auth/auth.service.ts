import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TOKEN_EXPIRES_IN } from 'common/constant/constants';
import { CONVERT_TIME, EUserStatus } from 'common/constant/gameConstants';
import { randomStr } from 'common/util';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { MailService } from 'modules/mail/mail.service';
import { User } from 'modules/user/schemas/user.schema';
import { UserService } from 'modules/user/user.service';
import { LoginByEmailDto } from './dtos/loginByEmail.dto';
import { LoginReturnDto } from './dtos/loginReturn.dto';
import { SignupDto } from './dtos/signup.dto';
import { SignEmailDto as SignEmailDto } from './dtos/signEmail.dto';
import { AuthReturnDto } from './dtos/authReturn.dto';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnprocessableException } from 'errorHandlers/unProcessable.exception';
import { UnAuthorizedException } from 'errorHandlers/unAuthorized.exception';
import { EUserEvent } from 'common/constant/eventConstants';

@Injectable()
export class AuthService {
  private readonly logger = new BackendLogger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signup(signupDto: SignupDto) {
    this.logger.log(`Signup ${signupDto.walletAddress.toLowerCase()}`);

    // const betaCheck = await this.userService.getBetaAccountByWallet(
    //   signupDto.walletAddress.toLowerCase(),
    // );

    // if (!betaCheck) {
    //   throw new UnprocessableException(
    //     'Wallet Address is not register for beta testing!',
    //     UNPROCESSABLE_ENTITY,
    //   );
    // }

    const userCheck = await this.userService.findOne({
      walletAddress: signupDto.walletAddress.toLowerCase(),
    });

    if (userCheck) {
      throw new UnprocessableException('Wallet Address already existed!');
    }

    signupDto.status = EUserStatus.MISSING_MAIL;
    signupDto.walletAddress = signupDto.walletAddress.toLowerCase();
    const user = await this.userService.signup(signupDto);

    return new AuthReturnDto(user);
  }

  async signEmail(signEmailDto: SignEmailDto) {
    this.logger.log(
      `signEmail in: ${signEmailDto.walletAddress.toLowerCase()}`,
    );
    const checkWallet = await this.userService.findOne({
      walletAddress: signEmailDto.walletAddress.toLowerCase(),
    });

    if (!checkWallet) {
      throw new UnprocessableException('Wallet Address is not existed!');
    }

    if (!signEmailDto.isResend) {
      const checkEmail = await this.userService.findOne({
        email: signEmailDto.email,
      });
      if (checkEmail) {
        throw new UnprocessableException('Email is allready exist!');
      }
    }

    const token = randomStr(6).toUpperCase();
    const passwordHash = await this.passwordHash(signEmailDto.password);

    const filter = { walletAddress: checkWallet.walletAddress.toLowerCase() };
    const update = {
      email: signEmailDto.email,
      password: passwordHash,
      status: EUserStatus.VERIFY_MAIL,
      verificationToken: token,
    };

    const user = await this.userService.findOneAndUpdate(filter, update);

    await this.mailService.sendUserConfirmation(user, token);

    return new AuthReturnDto(user);
  }

  async verifyEmail(token: string) {
    this.logger.log(`verifyEmail: ${token}`);
    const userCheck = await this.userService.findOne({
      verificationToken: token,
    });

    if (!userCheck) {
      throw new UnprocessableException('Verification failed!');
    }

    const filter = { walletAddress: userCheck.walletAddress.toLowerCase() };
    const update = {
      status: EUserStatus.MISSING_NAME,
      verificationToken: null,
    };

    const user = await this.userService.findOneAndUpdate(filter, update);

    return this.createToken(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(`forgotPassword: ${forgotPasswordDto.email}`);
    const userCheck = await this.userService.findOne({
      email: forgotPasswordDto.email,
    });

    if (!userCheck) {
      throw new UnprocessableException('Email is not existed');
    }

    const token = randomStr(6).toUpperCase();

    const filter = { walletAddress: userCheck.walletAddress.toLowerCase() };
    const update = {
      resetToken: token,
      resetTokenExpires: new Date(Date.now() + CONVERT_TIME.DAY),
    };

    const user = await this.userService.findOneAndUpdate(filter, update);

    await this.mailService.sendUserForgotPasswold(user, token);

    return new AuthReturnDto(user);
  }

  async validateResetToken(token: string) {
    this.logger.log(`verifyEmail: ${token}`);
    const user = await this.userService.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnprocessableException('Invalid token!');
    }
    return user;
  }

  async resetPassword(token: string, password: string) {
    this.logger.log(`verifyEmail: ${token}`);
    const validateUser = await this.validateResetToken(token);

    const filter = { walletAddress: validateUser.walletAddress.toLowerCase() };
    const passwordHash = await this.passwordHash(password);
    const update = {
      password: passwordHash,
      resetToken: null,
    };

    const user = await this.userService.findOneAndUpdate(filter, update);

    return new AuthReturnDto(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne({
      walletAddress: loginDto.walletAddress.toLowerCase(),
    });
    this.logger.log(`Logging user in:`);
    // Email was invalid
    if (!user) {
      this.logger.warn(
        `User not found: ${loginDto.walletAddress.toLowerCase()}`,
      );
      throw new UnAuthorizedException('Invalid wallet account!');
    }

    // Account is locked
    if (user.status === EUserStatus.INACTIVE) {
      this.logger.warn(
        `User attempted to login to locked account: ${loginDto.walletAddress.toLowerCase()}`,
      );
      throw new UnprocessableException('Account locked');
    }

    this.eventEmitter.emit(EUserEvent.USER_LOGIN, {
      userId: user.id,
    });

    return this.createToken(user);
  }

  async loginWithEmail(loginByEmailDto: LoginByEmailDto) {
    const user = await this.userService.findOne({
      email: loginByEmailDto.email,
    });
    this.logger.log(`Logging user in: ${user}`);
    // Email was invalid
    if (!user) {
      this.logger.warn(`User not found: ${loginByEmailDto.email}`);
      throw new UnprocessableException('Invalid email!');
    }

    // Account is locked
    if (user.status === EUserStatus.INACTIVE) {
      this.logger.warn(
        `User attempted to login to locked account: ${loginByEmailDto.email}`,
      );
      throw new UnprocessableException('Account locked');
    }

    // Check password
    if (!this.validatePassword(user, loginByEmailDto.password)) {
      throw new UnprocessableException('Invalid email/password');
    }

    this.eventEmitter.emit(EUserEvent.USER_LOGIN, {
      userId: user.id,
    });

    return this.createToken(user);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOne({
      walletAddress: payload.walletAddress.toLowerCase(),
    });
    if (!user) {
      throw new UnprocessableException('Invalid token');
    }
    return user;
  }

  validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  async passwordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createToken(user: User): Promise<LoginReturnDto> {
    const accessToken = this.jwtService.sign({
      walletAddress: user.walletAddress.toLowerCase(),
    });
    const response = new LoginReturnDto({
      expiresIn: TOKEN_EXPIRES_IN,
      accessToken,
      _id: user._id,
      avatarCode: user.avatarCode,
      name: user.name,
      email: user.email,
      status: user.status,
      campaignStage: user.campaignStage,
    });

    return response;
  }
}
