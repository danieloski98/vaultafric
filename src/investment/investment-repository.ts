import { EntityRepository, Repository } from 'typeorm';
import { InvestmentEntity } from './entity/investment.entity';

@EntityRepository(InvestmentEntity)
export class InvestmentRepository extends Repository<InvestmentEntity> {}
