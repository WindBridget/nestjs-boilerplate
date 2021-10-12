import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'modules/user/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to WARENA Confirm your Email',
      template: './confirmation',
      context: {
        name: user.name,
        token,
      },
    });
  }

  async sendUserForgotPasswold(user: User, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to WARENA forgot password',
      template: './forgotPassword',
      context: {
        name: user.name,
        token,
      },
    });
  }
}
