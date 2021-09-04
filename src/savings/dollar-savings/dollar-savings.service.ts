import { Injectable, Logger } from '@nestjs/common';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';
import { UserRepository } from '../../auth/repository/user.repository';
import { Like } from 'typeorm';

@Injectable()
export class DollarSavingsService {
  private readonly logger = new Logger('DollarSavingsService', true);

  constructor(private userRepository: UserRepository) {
    this.logger.log('Dollar Savings Initialised');
  }

  async buyDollar(amount: number): Promise<void> {
    this.logger.log(`Buy dollar called - N${amount}`);
    return Promise.resolve(undefined);
  }

  async convertDollars(amount: number): Promise<void> {
    this.logger.log(`Convert dollar called - N${amount}`);
    return Promise.resolve(undefined);
  }

  async transferDollar(transferDollarDto: TransferDollarDto): Promise<void> {
    this.logger.log(`Transfer dollar to vaulter - '${transferDollarDto.vaulter.username}'`);
    return Promise.resolve(undefined);
  }

  async findVaulter(usernameStub: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'phoneNumber', 'username', 'firstname', 'lastname'],
      where: { username: Like(`${usernameStub}`) }
    });

    this.logger.log(`Find vaulter with username starting with '${usernameStub}'`);

    return user;
  }
}