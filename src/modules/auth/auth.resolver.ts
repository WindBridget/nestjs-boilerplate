import { Args, Query, Resolver } from '@nestjs/graphql';
import { LoginReturnDto } from 'modules/auth/dtos/loginReturn.dto';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { LoginRecordService } from 'modules/loginRecord/loginRecord.service';
import { UserService } from 'modules/user/user.service';
import { AuthService } from './auth.service';
import { LoginByEmailDto } from './dtos/loginByEmail.dto';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new BackendLogger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loginRecordService: LoginRecordService,
  ) {}

  @Query(() => LoginReturnDto)
  async loginWithEmail(@Args() loginByEmailDto: LoginByEmailDto) {
    console.log('loginWithEmail', loginByEmailDto);
    const token = await this.authService.loginWithEmail(loginByEmailDto);
    return token;
  }
}
