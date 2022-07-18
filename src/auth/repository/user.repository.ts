import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { NewPasswordDto } from '../dto/new-password.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name, true);

  async recordExist(options: UserRecord) {
    return await this.findOne({
      where: [{ email: options.email }, { phoneNumber: options.phoneNumber }],
    });
  }

  async createUser(signUpCredentialsDto: SignUpCredentialsDto) {
    const { email, password, firstname, lastname, phoneNumber } =
      signUpCredentialsDto;

    const hashedPassword = await this.hashPassword(password);
    const user = this.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phoneNumber,
    });

    await this.save(user);

    return user;
  }

  async createPassword(user: User, newPasswordDto: NewPasswordDto) {
    const { password } = newPasswordDto;

    user.password = await this.hashPassword(password);

    await this.save(user);
  }

  async hashPassword(userPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(userPassword, salt);
  }
}

export interface UserRecord {
  email: string;
  phoneNumber: string;
}
