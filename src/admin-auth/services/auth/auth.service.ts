import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminSignUpDTO } from 'src/admin-auth/DTO/SignupDTO';
import { AdminRepository } from 'src/admin-auth/entity/admin-repository';
import { EmailInUserException } from 'src/exception/email-in-us';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, true);

  constructor(
    @InjectRepository(AdminRepository) private adminRepo: AdminRepository,
  ) {}

  async createAdminAccount(payload: AdminSignUpDTO) {
    const exisit = await this.adminRepo.recordExisit(payload);
    this.logger.error(exisit);

    if (exisit !== undefined) {
      throw new EmailInUserException();
    }

    // create account
    const newUser = await this.adminRepo.createAdmin(payload);
    this.logger.log(newUser);
    return {
      message: 'Account created',
      data: newUser,
    };
  }

  async updateAvatarImage(id: string, image: Express.Multer.File) {
    const exisit = await this.adminRepo.find({
      where: [{ id }],
    });

    if (exisit === undefined) {
      throw new BadRequestException('Admin account not found');
    }

    await this.adminRepo.updateAvatar(id, image);

    return {
      message: 'Avatar updated',
    };
  }
}
