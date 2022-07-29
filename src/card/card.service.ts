import { Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entity/user.entity';
import { AddCardDto } from './dto/add-card.dto';
import {encrypt} from './encryption-service';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from './card-repository';
import { CardNotFoundException } from '../exception/card-not-found-exception';
import { DuplicateCardException } from 'src/exception/duplicate-card-exception';

@Injectable()
export class CardService {

  private readonly logger = new Logger(CardService.name, true);

  constructor(
    @InjectRepository(CardRepository)
    private repository: CardRepository,
  ) {}

  async addCard(user: User, addCardDto: AddCardDto) {
    this.logger.log(`addCard called`);

    const { name, cvv, pin, number, expiryDate } = addCardDto;

    const text = `${number};${cvv};${expiryDate};${pin}`;
    const encrypted = encrypt(text);
    this.logger.log(encrypted);
    //TODO verify if card detail is valid via OnePipe API
    const cid = 'card-one-pipe-id';

    const existingCard = await this.repository.findOne({
      where: {user, name, cid, expiry: expiryDate}
    });

    if(existingCard) {
      throw new DuplicateCardException();
    }

    const numberStr = ''+number;
    const last = numberStr.substring(numberStr.length - 4, numberStr.length);

    //TODO If valid, save else report message to user;
    const card = this.repository.create({user, cid, expiry: expiryDate, name, last});
    await this.repository.save(card);

    return { message: 'Your card has been added' };
  }

  async removeCard(user: User, id: string) {
    this.logger.log(`removeCard called`);

    const card = await this.getCard(user, id)
    await this.repository.remove(card);

    return Promise.resolve({ message: 'Your card has been removed' });
  }

  async getCards(user: User) {
    return await this.repository.createQueryBuilder('card')
      .where('card.user.id = :id', {id: user.id})
      .getMany();
  }

  async getCard(user: User, id: string) {
    const card = await this.repository.createQueryBuilder('card')
      .where('card.user.id = :userId', {userId: user.id})
      .andWhere('card.id = :id', {id})
      .getOne();

    if(!card) {
      throw new CardNotFoundException();
    }

    return card;
  }
}
