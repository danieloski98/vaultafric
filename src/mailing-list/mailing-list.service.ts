import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { MailingListDto } from './mailing-list-dto';
import { MailingList } from './mailing-list-entity';

@Injectable()
export class MailingListService {
  constructor(
    @InjectRepository(MailingList)
    private mailinglistRepo: Repository<MailingList>,
    private notificationService: NotificationService,
  ) {}

  async createListEntry(email: string) {
    // check if email exists
    const entryExist = await this.mailinglistRepo.find({ where: { email } });
    if (entryExist.length > 0) {
      throw new BadRequestException('Already in the mailing list');
    }

    // create new entry
    await this.mailinglistRepo.insert({ email });

    // send out email to user
    await this.notificationService.sendMailingListUserEmail(email);

    return {
      message: 'Email saved',
      status: 201,
    };
  }
}
