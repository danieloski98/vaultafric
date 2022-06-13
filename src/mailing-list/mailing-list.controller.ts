import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailingListDto } from './mailing-list-dto';
import { MailingList } from './mailing-list-entity';
import { MailingListService } from './mailing-list.service';

@Controller('mailing-list')
export class MailingListController {
  constructor(private mailingListService: MailingListService) {}

  @ApiTags('MAILING LIST')
  @ApiBody({ type: MailingList })
  @Post()
  createEntry(@Body() body: Partial<MailingListDto>) {
    return this.mailingListService.createListEntry(body.email);
  }
}
