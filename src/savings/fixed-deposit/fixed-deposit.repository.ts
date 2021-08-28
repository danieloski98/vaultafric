import { EntityRepository, Repository } from 'typeorm';
import { FixedDeposit } from './fixed-deposit.entity';

@EntityRepository(FixedDeposit)
export class FixedDepositRepository extends Repository<FixedDeposit> {}