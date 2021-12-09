import * as meaningfulString from 'meaningful-string';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpRepository } from '../repository/otp.repository';
import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Otp } from '../entity/otp.entity';

const otpOptions = {
  min: 6,
  max: 6,
  onlyNumbers: true,
}

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpRepository)
    private otpRepository: OtpRepository
  ) {}

  async getOTPCode(user: User): Promise<string> {
    const otp = OtpService.generateOTP();
    const otpCode = await this.otpRepository.createOtp({otp, user});
    return otpCode.otp;
  }

  async getOtpModel(otp: string): Promise<Otp> {
    return await this.otpRepository.findOne({ otp });
  }

  async delete(otp: Otp) : Promise<void> {
    await this.otpRepository.remove(otp );
  }

  private static generateOTP(): string {
    return meaningfulString.random(otpOptions);
  }

}