import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { changePasswordDTO } from 'src/admin-auth/DTO/ChangepasswordDTO';
import { AdminEntity } from 'src/admin-auth/entity/admin-entity';
import { AdminRepository } from 'src/admin-auth/entity/admin-repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository) private adminRepo: AdminRepository,
  ) {}

  async getAllAdmins() {
    const data = await this.adminRepo.find();
    return {
      data,
    };
  }

  async deleteAdmin(id: string) {
    const dele = await this.adminRepo.delete({ id });
    if (dele.affected < 1) {
      return {
        message: 'ACCOUNT NOT DELETED, TRY AGAIN',
      };
    } else {
      return {
        message: 'ACCOUNT DELETED',
      };
    }
  }

  async updateAdminDetails(id: string, body: Partial<AdminEntity>) {
    const exist = await this.adminRepo.find({
      where: { id },
    });

    if (exist === undefined) {
      throw new BadRequestException('RECORD NOT FOUND');
    }

    delete body.password;

    const edit = await this.adminRepo.update({ id }, { ...body });
    const newadmin = await this.adminRepo.find({ where: { id } });
    return {
      mesage: 'Record updated',
      data: newadmin,
    };
  }

  async changePassword(id: string, passwords: changePasswordDTO) {
    const exist = await this.adminRepo.find({
      where: { id },
    });

    if (exist === undefined) {
      throw new BadRequestException('RECORD NOT FOUND');
    }

    const passwordMatch = await compare(
      passwords.oldpassword,
      exist[0].password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('PASSWORD DOES NOT MATCH');
    } else if (passwords.newpassword === passwords.oldpassword) {
      throw new BadRequestException('INVALID');
    }
    const password = await this.adminRepo.hashPassword(passwords.newpassword);
    await this.adminRepo.update({ id }, { password, active: false });

    return {
      message: 'PASSWORD CHANGED. YOU HAVE TO LOGIN AGAIN',
    };
  }
}
