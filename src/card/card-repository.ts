import { CardEntity } from './card.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CardEntity)
export class CardRepository extends Repository<CardEntity> {}