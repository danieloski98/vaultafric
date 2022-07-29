import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { AddCardDto } from './dto/add-card.dto';
import { CardService } from './card.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiTags('CARD')
  @Get()
  getCards(@GetUser() user: User) {
    return this.cardService.getCards(user);
  }

  @ApiTags('CARD')
  @HttpCode(HttpStatus.OK)
  @Post()
  addCard(@GetUser() user: User, @Body(ValidationPipe) addCardDto: AddCardDto) {
    return this.cardService.addCard(user, addCardDto);
  }

  @ApiTags('CARD')
  @Get(':id')
  getCard(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.cardService.getCard(user, id);
  }

  @ApiTags('CARD')
  @Delete('/:id')
  removeCard(@GetUser() user: User, @Param('id') id: string) {
    return this.cardService.removeCard(user, id);
  }
}
