import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AdminEntity } from './admin-entity';
import { genSalt, hash } from 'bcrypt';
import { AdminSignUpDTO } from '../DTO/SignupDTO';

@EntityRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity> {
  private readonly logger = new Logger(AdminRepository.name, true);

  async recordExisit(option: AdminEntity | AdminSignUpDTO) {
    return await this.findOne({
      where: [{ email: option.email }, { password: option.password }],
    });
  }

  async getSingleAdmin(id: string) {
    return await this.findOne({
      where: { id },
    });
  }

  async getAllAdmins() {
    return await this.find();
  }

  async updateAdmin(id: string, payload: AdminSignUpDTO) {
    await this.update({ id }, { ...payload });
  }

  async updateAvatar(id: string, avatar: Express.Multer.File) {
    await this.update({ id }, { avatar: avatar.buffer.toString('base64') });
  }

  async changeStatus(id: string, status: boolean) {
    await this.update({ id }, { active: status });
  }

  async createAdmin(signupDTO: AdminSignUpDTO) {
    const { email, password, fullname, active, position } = signupDTO;
    const hashedPassword = await this.hashPassword(password);

    const admin = this.create({
      email,
      password: hashedPassword,
      fullname,
      active,
      position,
    });

    await this.save(admin);

    return admin;
  }

  async hashPassword(userPassword: string): Promise<string> {
    const salt = await genSalt();
    return await hash(userPassword, salt);
  }
}
