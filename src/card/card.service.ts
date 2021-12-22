import { Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entity/user.entity';
import { AddCardDto } from './dto/add-card.dto';

@Injectable()
export class CardService {

  private readonly logger = new Logger(CardService.name, true);

  async addCard(user: User, addCardDto: AddCardDto) {
    this.logger.log(`addCard called`);

    return Promise.resolve({ message: 'Your card has been added' });
  }

  removeCard(user: User, id: string) {
    this.logger.log(`removeCard called`);

    return Promise.resolve({ message: 'Your card has been removed' });
  }
}
