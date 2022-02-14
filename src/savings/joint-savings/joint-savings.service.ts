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

    const tokenArray = this.generateToken(groupName, createJointSavingsDto.participants.map(x => x.id));

    this.logger.log(`Save JointSavings account`)
    const savingsAccount = await this.jointSavingsRepository.save({ ...createJointSavingsDto, owner: user });

    this.logger.log(`Save participants record`)
    await this.participantsRepo.saveParticipants(savingsAccount, tokenArray, createJointSavingsDto.participants);

    this.logger.log(`Notify participants via email`)
    await this.notifyParticipants(createJointSavingsDto.participants.map(x => x.email), groupName, tokenArray);

    return this.getGroup(user, groupName);
  }

  private generateToken = (groupName: string, ids: string[]) => {
    this.logger.log(`Build JointSavings token for - ${groupName}`);
    const tokenArray = Array<string>();

    const link = generate.random({ min: 70, max: 80});
    ids.forEach(id => {
      tokenArray.push(`${link};${md5(groupName)}@--${id}`.toUpperCase());
    })
    return tokenArray;
  };

  async notifyParticipants(emails: string[], groupName: string, tokenArray: string[]) {
    this.logger.log(`Notify JointSavings Group participants`);

    for (let i = 0; i < tokenArray.length; i++) {
      let message = this.getEmailMessage(groupName, tokenArray, i);
      await this.notificationService.sendJointSavingsInvitation(message, emails[i]);
    }
  }

  private getEmailMessage = (groupName: string, tokenArray: string[], i: number) => {
    let message = `Hi, <p>${process.env.INVITATION_EMAIL}</p>`;
    message += `<p>Group Name: <b>${groupName}</b></p>`;
    message += `<p>Click the link to join JointSavings Group</p>`;
    message += `<p><a href='https://api.vaultafrica.co/joint-savings/join/${tokenArray[i]}'><b>Join Group</b></a></p>`;
    return message;
  };

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

  async joinGroupSavings(joinToken: string) {
    this.logger.log(`Activate group savings for ${joinToken}`);
    await this.participantsRepo.activateGroupSavings(joinToken)
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