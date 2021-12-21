import { Otp } from '../entity/otp.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp> {

  private readonly logger = new Logger(OtpRepository.name, true);

  async createOtp(otp: string, user: User, expiresIn: number): Promise<Otp> {
    this.logger.log("CreateOTP called");

    try {
      const otpEntity = this.create({otp, user, expiresIn});
      await this.save(otpEntity);

      return otpEntity;
    }catch(e) {
      this.logger.error(`An error occurred while creating otp: ${e}`);
      throw new InternalServerErrorException();
    }
  }

}