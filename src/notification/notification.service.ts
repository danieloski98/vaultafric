import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  },
  logger: true
});

@Injectable()
export class NotificationService {

  async sendConfirmAccountOTP(email: string, otp: string): Promise<void> {
    const content = `Your confirmation code is ${otp}`;

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      subject: 'VaultAfrica Confirmation Code',
      text: content,
      to: email
    });
  }

}
