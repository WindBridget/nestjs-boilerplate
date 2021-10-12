import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginRecordModule } from 'modules/loginRecord/loginRecord.module';
import { MailModule } from 'modules/mail/mail.module';
import { UserModule } from 'modules/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: process.env.APP_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UserModule,
    LoginRecordModule,
    MailModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
