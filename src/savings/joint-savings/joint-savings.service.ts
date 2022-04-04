import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JointSavingsRepository } from './repository/joint-savings.repository';
import { CreateJointSavingsDto } from './dto/create-joint-savings.dto';
import { User } from '../../auth/entity/user.entity';
import { DuplicateJointSavingsException } from '../../exception/duplicate-joint-savings-exception';
import { ProfileService } from '../../auth/service/profile.service';
import { JointSavingsNotFoundException } from '../../exception/joint-savings-not-found-exception';
import { NotificationService } from '../../notification/notification.service';
import { config } from 'dotenv';
import { JointSavingsParticipantsRepository } from './repository/joint-savings-participants.repository';
import { WithdrawDto } from './dto/withdraw.dto';
import { InsufficientBalanceException } from '../../exception/insufficient-balance.exception';
import { JointSavingsNotStartedException } from '../../exception/joint-savings-not-started-exception';
import { JointSavingCreated } from './joint-saving.created';
import { ActivationLinkService } from './activation-link.service';
import { JointSavings } from './entity/joint-savings.entity';

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
    private notificationService: NotificationService,
    private joinLinkService: ActivationLinkService
  ) {}

  async findParticipants(phone: string) {
    this.logger.log(`find participants with phone number`);
    return await this.profileService.findConfirmedVaultersByPhone(phone);
  }

  async createJointSavings(owner: User, createJointSavingsDto: CreateJointSavingsDto, avatar?: Buffer) {
    this.logger.log(`Create and save joint savings account`);

    const { savingsName, groupName, participants } = createJointSavingsDto;
    const failed = await this.verifyParticipants(participants);

    const groupExist = await this.jointSavingsRepository.exist(groupName, savingsName, owner);
    if(groupExist) {
      this.logger.error(`Duplicate JointSavings found`);
      throw new DuplicateJointSavingsException();
    }

    if(avatar) {
      this.logger.log(`Savings Avatar found...converting to base64`);
      createJointSavingsDto.avatar = avatar.toString('base64');
    }

    this.logger.log(`Save JointSavings account`)
    const savingsAccount = await this.jointSavingsRepository.save({ ...createJointSavingsDto, owner });

    this.logger.log(`Save participants record`)
    await this.participantsRepo.saveParticipants(savingsAccount, participants);

    await this.notifyParticipants(participants, savingsAccount);

    return await this.savingsCreatedResponse(`JointSavings started`, participants, failed, owner, groupName);
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

  async joinGroupSavings(user: User, groupId: string, activationLink: string) {
    this.logger.log(`Activate group savings for '${activationLink}'`);

    await this.joinLinkService.validateLink(user, activationLink);
    await this.participantsRepo.activateGroupSavings(user);

    return { message: `Joint Savings now active` }
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

  async getTotalBalance(user: User) {
    const jointSavings = await this.jointSavingsRepository.findOne({
      where: {owner: user},
      select: ['balance']
    });

    let balance = 0;
    if(jointSavings) {
      balance = jointSavings.balance;
    }

    return { balance };
  }

  private notifyParticipants = async (participants: User[], jointSavings: JointSavings) => {
    this.logger.log(`Notify participants via email`);

    const { groupName, id } = jointSavings;
    const emails = participants.map(user => user.email);
    const activationLinks = await this.joinLinkService.getActivationLinks(participants, jointSavings);

    for (let i = 0; i < activationLinks.length; i++) {
      let message = this.createEmailMessage({ name:groupName, id }, activationLinks[i]);
      await this.notificationService.sendJointSavingInvite(message, emails[i]);
    }
    this.logger.log(`Invitation email sent`);
  }

  private verifyParticipants = async (participants: User[]) => {
    let tempParticipants = Array<User>();
    const failed = Array<User>();

    Object.assign(tempParticipants, participants);

    for (const friend of tempParticipants) {
      const profileExist = await this.profileService.exist(friend);
      if (profileExist === false) {
        const index = participants.indexOf(friend, 0);
        participants.splice(index, 1);
        failed.push(friend);
      }
    }

    if (participants.length === 0) {
      this.logger.error(`Invalid vault users`);
      const response = await this.savingsCreatedResponse(`JointSavings cannot be started`, participants, failed);
      throw new JointSavingsNotStartedException(response);
    }
    return failed;
  }

  private savingsCreatedResponse = async (message: string, participants: User[],
                                          failed: User[], user?: User, groupName?: string) => {
    let group;
    if(user) {
      group = await this.getGroup(user, groupName)
    }
    const response: JointSavingCreated = {
      message, group,
      successfulInvitations: {
        count: participants.length,
        friends: participants
      },
      failedInvitations: {
        count: failed.length,
        friends: failed
      },
    };
    return response;
  }

  private createEmailMessage = (group: Group, activationLink: string) => {
    let message = `Hi, <p>${process.env.INVITATION_EMAIL}</p>`;
    message += this.asParagraph(`Group Name: <b>${group.name}</b>`)
    message += this.asParagraph(`Click the link to join JointSavings Group`);
    message += this.asParagraph(`<a href='https://api.vaultafrica.co/joint-savings/join/${group.id}/${activationLink}'><b>Join Group</b></a>`);

    return message;
  }

  private asParagraph = (content: string) => {
    return `<p>${content}</p>`
  }

  private async getGroup(user: User, groupName: string) {
    return await this.jointSavingsRepository
      .createQueryBuilder('js')
      .where('js.owner.id = :userId', {userId: user.id})
      .andWhere('js.groupName = :groupName', {groupName})
      .getOne()
  }

}
interface Group { name: string, id: string }

