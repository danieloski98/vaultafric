import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exists } from 'fs';
import { AdminLoginDTO } from 'src/admin-auth/DTO/LoginDto';
import { AdminSignUpDTO } from 'src/admin-auth/DTO/SignupDTO';
import { AdminRepository } from 'src/admin-auth/entity/admin-repository';
import { EmailInUserException } from 'src/exception/email-in-us';
import { sign } from 'jsonwebtoken';
import Cloudinary from 'src/common/utils';
import { join } from 'path';

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

    // upload file to cloudinary
    const avatar = await Cloudinary.uploader.upload(image.path);

    console.log(avatar.secure_url);
    await this.adminRepo.updateAvatar(id, avatar.secure_url);

    return {
      message: 'Avatar updated',
    };
  }

  async login(admin: AdminLoginDTO) {
    const exist = await this.adminRepo.find({
      where: [{ email: admin.email }],
    });

    if (exist === undefined) {
      throw new BadRequestException('Admin account not found');
    }

    // generate token
    const token = sign({ ...admin }, process.env.JWT_KEY, {
      expiresIn: '1h',
    });
    // mark the admin status as active
    await this.adminRepo.update({ id: exist[0].id }, { active: true });
    return {
      message: 'Login sucessful',
      data: { ...exist[0], token },
    };
  }

  async logout(id: string) {
    const exist = await this.adminRepo.find({
      where: { id },
    });
    if (exist.length < 1) {
      throw new BadRequestException('ADMIN NOT FOUND');
    }
    // mark the admin status as active
    await this.adminRepo.update({ id }, { active: false });

    return {
      message: 'Logout successful',
    };
  }
}
