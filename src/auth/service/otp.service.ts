import { InjectRepository } from '@nestjs/typeorm';
import { OtpRepository } from '../repository/otp.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateOTP } from '../config';
import { User } from '../entity/user.entity';
import { OtpDto } from '../dto/otp.dto';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { Otp } from '../entity/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpRepository)
    private otpRepository: OtpRepository
  ) {}

  async getOTPCode(user: User): Promise<string> {
    const otpDTO : OtpDto = {
      otp: generateOTP(), user
    }

    const { otp } = await this.otpRepository.createOtp(otpDTO);
    return otp;
  }

  async getOtpModel(otp: string): Promise<Otp> {
    return await this.otpRepository.findOne({ otp });
  }

  async delete(otp: Otp) : Promise<void> {
    await this.otpRepository.remove(otp );
  }

  // async getUserByOtp(otp: string): Promise<User> {
  //   const model = await this.otpRepository.findOne({otp});
  //   if(!model) {
  //     throw new BadRequestException('')
  //   }
  //   return model.user;
  // }
}