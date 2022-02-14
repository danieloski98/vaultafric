import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {config} from "dotenv";
import { EmailNotSentException } from '../exception/email-not-sent-exception';

config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  },
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
      this.logger.log(`Sending email...`);

      await transport.sendMail({
        from: `"VaultAfrica" ${process.env.EMAIL_USER}`,
        subject: 'VaultAfrica OTP Code',
        text, html,
        to: email
      });
    }catch(error) {
      this.logger.error(`Error sending email: ${error}`);
      throw new EmailNotSentException();
    }

    this.logger.log(`...email sent`);
    await Promise.resolve();
  }

  async sendJointSavingsInvitation(content: string, email: string){
    const html = `<p>${content}</p>`;
    // const text = content;

    try{
      this.logger.log(`Sending email to ${email}`);

        await transport.sendMail({
          from: `"VaultAfrica" ${process.env.EMAIL_USER}`,
          subject: `JointSavings Group Invitation`,
          html,
          to: email
        });

        this.logger.log(`...email sent`);
    }catch (e) {
      this.logger.error(`Error sending email: ${e}`);
      throw new EmailNotSentException();
    }

  }

}
