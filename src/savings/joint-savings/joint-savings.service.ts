import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JointSavingsRepository } from './joint-savings.repository';
import { UserRepository } from '../../auth/repository/user.repository';
import { CreateJointSavingsDto } from './dto/create-joint-savings.dto';
import { Like } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { JointSavingsEntity } from './joint-savings.entity';

@Injectable()
export class JointSavingsService {
  private readonly logger = new Logger('JointSavingsController', true);

  constructor(
    @InjectRepository(JointSavingsRepository)
    private jointSavingsRepository: JointSavingsRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async findParticipants(usernameStub: string): Promise<User[]>{
    const participants = await this.userRepository.find({
      select: ['id', 'email', 'phoneNumber', 'username', 'firstname', 'lastname'],
      where: { username: Like(`${usernameStub}%`) }
    });

    this.logger.log(`find participants with username like '${usernameStub}' with result: '${participants}'`);

    return  participants;
  }

  async createJointSavings(owner: User, createJointSavingsDto: CreateJointSavingsDto): Promise<JointSavingsEntity> {
    const { savingsName, groupName, end, start, friends, pattern, targetAmount } = createJointSavingsDto;
    const jointSavingsAccount = this.jointSavingsRepository.create({ owner, savingsName, groupName, end, start, friends, pattern, targetAmount });

    try {
      await this.jointSavingsRepository.save(jointSavingsAccount);
    }catch (e) {
      this.logger.error(e);
    }

    return jointSavingsAccount;
  }

  // TODO: Internal method, shouldn't be called by controller
  async notifyParticipants(): Promise<void> {}

  withdraw() {

  }
}