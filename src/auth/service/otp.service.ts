import * as meaningfulString from 'meaningful-string';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpRepository } from '../repository/otp.repository';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Otp } from '../entity/otp.entity';
import { DateTime } from 'luxon';
import { config } from 'dotenv';

config();

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name, true);

  constructor(
    @InjectRepository(OtpRepository)
    private otpRepository: OtpRepository,
  ) {}

  isExpired(model: Otp): boolean {
    this.logger.log(`Has OTP expired...`);

    const currentMillisecond = OtpService.getExpiration(0);
    const isExpired = currentMillisecond > model.expiresIn;

    this.logger.log(`...${isExpired}`);

    return isExpired;
  }

  private generateOTP() {
    this.logger.log(`Generating OTP...`);

    const otp = meaningfulString.random({
      min: 6,
      max: 6,
      onlyNumbers: true,
    });
    const expiresIn = OtpService.getExpiration(+process.env.OTP_EXPIRATION);

    this.logger.log(`...OTP generated`);

    return { otp, expiresIn };
  }

  async getOTP(user: User): Promise<number> {
    const { otp, expiresIn } = this.generateOTP();

    // get existing OTP or create new
    const otpModel =
      (await this.otpRepository.findOne({ where: { user } })) ??
      (await this.otpRepository.save({ otp, user, expiresIn }));

    // update if OTP is expired
    if (this.isExpired(otpModel)) {
      otpModel.otp = otp;
      otpModel.expiresIn = expiresIn;
      await this.otpRepository.save(otpModel);
    }

    return otpModel.otp;
  }

  async getOtpModel(otp: number): Promise<Otp> {
    this.logger.log(`Find otp model...`);

    const model = await this.otpRepository.findOne({
      where: { otp },
    });

    if (model) {
      this.logger.log(`...model found`);
    }

    return model;
  }

  async delete(otp: Otp): Promise<void> {
    this.logger.log(`Delete otp: ${otp.otp}`);
    try {
      await this.otpRepository.remove(otp);
    } catch (e) {
      this.logger.error(e);
    }
    this.logger.log(`OTP deleted;`);
  }

  private static getExpiration(minute: number): number {
    return DateTime.now().plus({ minute }).toMillis();
  }
}
