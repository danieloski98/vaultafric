import { Otp } from '../entity/otp.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { OtpDto } from '../dto/otp.dto';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp> {

  async createOtp(otpDto: OtpDto): Promise<Otp> {
    const { otp, user } = otpDto;
    const otpEntity = this.create({otp, user});

    try {
      await this.save(otpEntity);
    }catch(e) {
      throw new InternalServerErrorException();
    }
    return otpEntity;
  }

}