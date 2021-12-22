import * as meaningfulString from 'meaningful-string';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpRepository } from '../repository/otp.repository';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Otp } from '../entity/otp.entity';
import { DateTime } from "luxon";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpRepository)
    private otpRepository: OtpRepository
  ) {}

  private readonly logger = new Logger(OtpService.name, true);

  async isValid(otpModel: Otp): Promise<boolean> {
    this.logger.log(`IsValid called`);

    const expiresIn = OtpService.getCurrentMillis(0);
    const model = await this.getOtpModel(otpModel.otp);

    return model.expiresIn > expiresIn;
  }

  async getOTPCode(user: User): Promise<string> {
    this.logger.log(`Get OTP called`);

    const otp = OtpService.generateOTP();
    const expiresIn = OtpService.getCurrentMillis(3);

    try {
      const model = await this.otpRepository.createOtp(otp, user, expiresIn);
      return model.otp;
    }catch (error) {
      this.logger.error(`An error occurred: ${error}`);
      throw new InternalServerErrorException();
    }
  }

  async getOtpByUserId(user: User): Promise<{ otp: string} | undefined> {
    const otpModel = await this.otpRepository.findOne({
      where: { user },
      relations: ['User']
    });

    if(otpModel)
      return { otp: otpModel.otp };
  }

  async getOtpModel(otp: string): Promise<Otp> {
    return await this.otpRepository.findOne({
      where: { otp }
    });
  }

  async delete(otp: Otp) : Promise<void> {
    await this.otpRepository.remove(otp);
  }

  private static generateOTP(): string {
    return meaningfulString.random({
      min: 6,
      max: 6,
      onlyNumbers: true,
    });
  }

  private static getCurrentMillis(minute: number): number {
    return DateTime.now().plus({minute}).toMillis();
  }

}