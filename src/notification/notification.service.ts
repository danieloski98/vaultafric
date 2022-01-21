import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {config} from "dotenv";

config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  },
  logger: true,
  connectionTimeout: +process.env.CONNECTION_TIMEOUT
});

@Injectable()
export class NotificationService {

  private readonly logger = new Logger(NotificationService.name);

  async sendOTP(email: string, otp: number): Promise<void> {
    this.logger.log(`Sending email to ${email}...`);

    const text = `Your OTP code is ${otp}`;
    const html = `Your OTP code is <h3>${otp}</h3>`

    try {
      await transport.sendMail({
        from: `"VaultAfrica" ${process.env.EMAIL_USER}`,
        subject: 'VaultAfrica OTP Code',
        text, html,
        to: email
      });
    }catch(error) {
      this.logger.error(`Error sending email: ${error}`);
    }

    this.logger.log(`...email sent`);
    await Promise.resolve();
  }

}
