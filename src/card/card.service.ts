import { Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entity/user.entity';
import { AddCardDto } from './dto/add-card.dto';
import {encrypt} from './encryption-service';

@Injectable()
export class CardService {

  private readonly logger = new Logger(CardService.name, true);

  async addCard(user: User, addCardDto: AddCardDto) {
    this.logger.log(`addCard called`);

    const { name, cvv, pin, number, expiryDate } = addCardDto;

    const text = `${number};${cvv};${expiryDate};${pin}`;
    const encrypted = encrypt(text)
    this.logger.log(encrypted);
    //TODO verify if card detail is valid via OnePipe API

    //TODO If valid, save else report message to user;

    return Promise.resolve({ message: 'Your card has been added' });
  }

  removeCard(user: User, id: string) {
    this.logger.log(`removeCard called`);

    return Promise.resolve({ message: 'Your card has been removed' });
  }
}
