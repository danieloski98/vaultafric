import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JointSavingsRepository } from './repository/joint-savings.repository';
import { CreateJointSavingsDto } from './dto/create-joint-savings.dto';
import { User } from '../../auth/entity/user.entity';
import { DuplicateJointSavingsException } from '../../exception/duplicate-joint-savings-exception';
import { ProfileService } from '../../auth/service/profile.service';
import { JointSavingsNotFoundException } from '../../exception/joint-savings-not-found-exception';
import { NotificationService } from '../../notification/notification.service';
import {config} from 'dotenv';
import { JointSavingsParticipantsRepository } from './repository/joint-savings-participants.repository';
import { WithdrawDto } from './dto/withdraw.dto';
import { InsufficientBalanceException } from '../../exception/insufficient-balance.exception';
import { md5 } from '../../../common/utils';
import * as generate from 'meaningful-string';

config();

@Injectable()
export class JointSavingsService {
  private readonly logger = new Logger('JointSavingsService', true);

  constructor(
    @InjectRepository(JointSavingsRepository)
    private jointSavingsRepository: JointSavingsRepository,

    @InjectRepository(JointSavingsParticipantsRepository)
    private participantsRepo: JointSavingsParticipantsRepository,

    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {}

  async findParticipants(phone: string) {
    this.logger.log(`find participants with phone number`);
    return await this.profileService.findConfirmedVaultersByPhone(phone);
  }

  async createJointSavings(user: User, createJointSavingsDto: CreateJointSavingsDto,
                           avatar?: Buffer) {
    this.logger.log(`Create and save joint savings account`);

    const { savingsName, groupName } = createJointSavingsDto;
    const savingsExist = await this.jointSavingsRepository.exist(groupName, savingsName, user);

    if(savingsExist) {
      this.logger.error(`Duplicate JointSavings found`);
      throw new DuplicateJointSavingsException();
    }

    if(avatar) {
      this.logger.log(`Savings Avatar found...converting to base64`);
      createJointSavingsDto.avatar = avatar.toString('base64');
    }

    const token = this.getToken(groupName);

    this.logger.log(`Save JointSavings account`)
    const savingsAccount = await this.jointSavingsRepository.save({ ...createJointSavingsDto, owner: user });

    this.logger.log(`Save participants record`)
    await this.participantsRepo.saveParticipants(savingsAccount, token, createJointSavingsDto.participants);

    this.logger.log(`Notify participants via email`)
    await this.notifyParticipants(createJointSavingsDto.participants, groupName, token);

    return this.getGroup(user, groupName);
  }

  private getToken = (groupName: string) => {
    this.logger.log(`Build JointSavings token for - ${groupName}`);

    const link = generate.random({ min: 50, max: 50});
    return `${link};${md5(groupName)}`
  };

  async notifyParticipants(users: User[], groupName: string, token: string) {
    this.logger.log(`Notify JointSavings Group participants`);
    const emails = users.map(x => x.email);
    let message = `Hi, <p>${process.env.INVITATION_EMAIL}</p>`;
    message += `<p>Group Name: ${groupName}</p>`
    message += `<p>Click the link to join JointSavings Group</p>`;
    message += `<p><a href='https://api.vaultafrica.co/joint-savings/join/${token}'>Join Group</a></p>`

    await this.notificationService.sendJointSavingsInvitation(message, emails);
  }

  async withdraw(user: User, withdrawDto: WithdrawDto) {
    this.logger.log(`Withdraw ${JSON.stringify(withdrawDto)}`);

    const {groupId, amount} = withdrawDto;
    const savings = await this.jointSavingsRepository.findOne({ where: {
      id: groupId, owner: user
    } });

    if(!savings) {
      this.logger.log(`JointSavings account: ${groupId} not found`);
      throw new JointSavingsNotFoundException();
    }

    if(savings.balance < amount) {
      this.logger.error(`Insufficient balance for withdrawal`);
      throw new InsufficientBalanceException();
    }

    // TODO: Onepipe handler
    savings.balance -= amount;

    return { message: `Your withdrawal is being processed`};
  }

  async joinGroupSavings(user: User, joinToken: string) {
    this.logger.log(`Activate group savings for ${JSON.stringify(user)}`);
    await this.participantsRepo.activateGroupSavings(user, joinToken)
  }

  async getGroupDetail(user: User, groupId: string) {
    this.logger.log(`Get JointSavings for group`);
    const jointSavings = await this.jointSavingsRepository.getJointSavings(user, groupId,  ['owner', 'participants']);

    if(!jointSavings) {
      this.logger.log(`JointSavings account not found ${groupId}`);
      throw new JointSavingsNotFoundException();
    }
    
    return jointSavings;
  }

  private async getGroup(user: User, groupName: string) {
    return await this.jointSavingsRepository
      .createQueryBuilder('js')
      .where('js.owner.id = :userId', {userId: user.id})
      .andWhere('js.groupName = :groupName', {groupName})
      .getOne()
  }
}