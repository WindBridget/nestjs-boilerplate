import { forwardRef, Module } from '@nestjs/common';
import { LoginRecordModule } from 'modules/loginRecord/loginRecord.module';
import { Role } from 'modules/user/schemas/role.schema';
import { User } from 'modules/user/schemas/user.schema';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypegooseModule.forFeature([User, Role]),
    LoginRecordModule,
  ],
  controllers: [],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
