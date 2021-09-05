import { EntityRepository, Repository } from 'typeorm';
import { LoanEntity } from './loan.entity';

@EntityRepository(LoanEntity)
export class LoanRepository extends Repository<LoanEntity>{}