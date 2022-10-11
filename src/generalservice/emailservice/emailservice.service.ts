import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Mg from 'nodemailer-mailgun-transport';
import { MailOptions } from 'nodemailer/lib/ses-transport';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class EmailService {
  logger = new Logger();
  private auth = {
    auth: {
      api_key: process.env.MAILGUN_SENDING_KEY,
      domain: process.env.DOMAIN,
    },
  };

  private transport = nodemailer.createTransport(Mg(this.auth));

  public async sendConfirmationEmail(email: string, code?: number) {
    console.log(process.env.MAILGUN_SENDING_KEY);
    try {
      const mailOption: MailOptions = {
        from: `Vault Africa ${process.env.COMPANY_EMAIL}`,
        to: email,
        subject: `Account Verification Code`,
        html: `<div> 
          <p>You are one step away from joining Vault Africa. Your verification code is below:</p>

        </br>
        <b>${code}</b>  </br>

        <p>Enter this verification code to verify your email.</p> </br>

        <p>Thank you for choosing Vault Africa!</p> </br>

        <p>We are happy to have you onboard.</p> </br>

        </div>`,
      };
      this.transport.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return {
        error: false,
        successMessage: 'Account creation email sent',
        statusCode: 200,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      };
    }
  }

  public async sendPasswordResetCode(email: string, code?: number) {
    console.log(process.env.MAILGUN_SENDING_KEY);
    try {
      const mailOption: MailOptions = {
        from: `Listify Enterprise ${process.env.COMPANY_EMAIL}`,
        to: email,
        subject: `Password Reset Code`,
        html: `<div> 
          <p>Your OTP code is</p>

        </br>
        <b>${code}</b>  </br>

        <p>support@listify.com</p>

        </div>`,
      };
      this.transport.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return {
        error: false,
        successMessage: 'Account creation email sent',
        statusCode: 200,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      };
    }
  }
}
