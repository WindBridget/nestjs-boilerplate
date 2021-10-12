import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TOKEN_EXPIRES_IN } from 'common/constant/constants';
import { EUserEvent } from 'common/constant/eventConstants';
import { EUserStatus } from 'common/constant/gameConstants';
import { UnprocessableException } from 'errorHandlers/unProcessable.exception';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { MailService } from 'modules/mail/mail.service';
import { User } from 'modules/user/schemas/user.schema';
import { UserService } from 'modules/user/user.service';
import { LoginByEmailDto } from './dtos/loginByEmail.dto';
import { LoginReturnDto } from './dtos/loginReturn.dto';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new BackendLogger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private eventEmitter: EventEmitter2,
  ) {}

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
      email: payload.email,
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
      email: user.email,
    });
    const response = new LoginReturnDto({
      expiresIn: TOKEN_EXPIRES_IN,
      accessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    });

    return response;
  }
}
