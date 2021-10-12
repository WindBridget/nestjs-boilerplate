import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginDto } from 'modules/auth/dtos/login.dto';
import { LoginReturnDto } from 'modules/auth/dtos/loginReturn.dto';
import { BackendLogger } from 'modules/logger/BackendLogger';
import { LoginRecordService } from 'modules/loginRecord/loginRecord.service';
import { UserService } from 'modules/user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { LoginByEmailDto } from './dtos/loginByEmail.dto';
import { SignEmailDto } from './dtos/signEmail.dto';
import { SignupDto } from './dtos/signup.dto';
import { AuthReturnDto } from './dtos/authReturn.dto';
import { UserWarriorService } from 'modules/userWarrior/userWarrior.service';
import { UserWarriorItemDto } from 'modules/userWarrior/dtos/userWarriorItem.dto';
import { UserWarriorRequestDto } from 'modules/userWarrior/dtos/userWarriorRequest.dto';
import { UserWebListWarriorDto } from 'modules/userWarrior/dtos/userWebListWarrior.dto';
import { UserWebListWarriorOrderDto } from 'modules/userWarrior/dtos/userWebListWarriorOrder.dto';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger = new BackendLogger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly loginRecordService: LoginRecordService,
    private readonly userWarriorService: UserWarriorService,
  ) {}

  @Mutation(() => AuthReturnDto)
  async signup(@Args() signupDto: SignupDto) {
    console.log('signup', signupDto);
    return await this.authService.signup(signupDto);
  }

  @Mutation(() => AuthReturnDto)
  async signEmail(@Args() signEmailDto: SignEmailDto) {
    console.log('SignEmailDto', signEmailDto);
    return await this.authService.signEmail(signEmailDto);
  }

  @Mutation(() => LoginReturnDto)
  async verifyEmail(@Args('token') token: string) {
    console.log('verifyEmail', token);
    return await this.authService.verifyEmail(token);
  }

  @Mutation(() => AuthReturnDto)
  async forgotPassword(@Args() forgotPasswordDto: ForgotPasswordDto) {
    console.log('forgotPassword', forgotPasswordDto);
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => AuthReturnDto)
  async resetPassword(
    @Args('token') token: string,
    @Args('password') password: string,
  ) {
    console.log('resetPassword', token, password);
    return await this.authService.resetPassword(token, password);
  }

  @Query(() => LoginReturnDto)
  async login(@Args() loginDto: LoginDto) {
    console.log('login', loginDto);
    const token = await this.authService.login(loginDto);

    // We'll only get to this point if the login is successful, so we
    // can create a login record now
    // const user = await this.userService.findOneByEmail(email);
    // await this.loginRecordService.create(req.ip, user.id);
    return token;
  }

  @Query(() => LoginReturnDto)
  async loginWithEmail(@Args() loginByEmailDto: LoginByEmailDto) {
    console.log('loginWithEmail', loginByEmailDto);
    const token = await this.authService.loginWithEmail(loginByEmailDto);
    return token;
  }

  @Query(() => UserWebListWarriorDto)
  async getWarriorsForWeb(
    @Args() userWarriorRequestDto: UserWarriorRequestDto,
  ) {
    return this.userWarriorService.getWarriorsForWeb(
      userWarriorRequestDto.sortBy,
      userWarriorRequestDto.orderBy,
      userWarriorRequestDto.page,
      userWarriorRequestDto.limit,
      userWarriorRequestDto.type,
      userWarriorRequestDto.element,
      userWarriorRequestDto.rarity,
      userWarriorRequestDto.role,
      userWarriorRequestDto.userId,
    );
  }

  @Query(() => UserWebListWarriorOrderDto)
  async getWarriorsOrderForWeb(
    @Args() userWarriorRequestDto: UserWarriorRequestDto,
  ) {
    return this.userWarriorService.getWarriorsOrders(
      userWarriorRequestDto.sortBy,
      userWarriorRequestDto.orderBy,
      userWarriorRequestDto.page,
      userWarriorRequestDto.limit,
      userWarriorRequestDto.type,
      userWarriorRequestDto.element,
      userWarriorRequestDto.rarity,
      userWarriorRequestDto.role,
      userWarriorRequestDto.userId,
    );
  }

  @Query(() => UserWarriorItemDto)
  async getWarriorDetail(@Args('userWarriorId') userWarriorId: string) {
    return this.userWarriorService.getWarriorDetail(userWarriorId);
  }
}
