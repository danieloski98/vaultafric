import { EntityRepository, Repository } from 'typeorm';
import { InvestmentEntity } from './investment.entity';

@EntityRepository(InvestmentEntity)
export class InvestmentRepository extends Repository<InvestmentEntity> {}