import { Module } from '@nestjs/common';
import { MailingListController } from './mailing-list.controller';
import { MailingListService } from './mailing-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingList } from './mailing-list-entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([MailingList]), NotificationModule],
  controllers: [MailingListController],
  providers: [MailingListService],
})
export class MailingListModule {}
