import { Body, Controller, Delete, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { AddCardDto } from './dto/add-card.dto';
import { CardService } from './card.service';


@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {

  constructor(
    private cardService: CardService
  ) {}

  @Post()
  addCard(@GetUser() user: User, @Body(ValidationPipe) addCardDto: AddCardDto): Promise<{ message: string }> {
    return this.cardService.addCard(user, addCardDto);
  }

  @Delete('/:id')
  removeCard(@GetUser() user: User, @Param('id') id: string): Promise<{message: string}> {
    return this.cardService.removeCard(user, id);
  }
}
