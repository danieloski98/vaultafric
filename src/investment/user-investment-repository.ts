import { EntityRepository, Repository } from 'typeorm';
import { UserInvestmentEntity } from './user-investment.entity';

@EntityRepository(UserInvestmentEntity)
export class UserInvestmentRepository extends Repository<UserInvestmentEntity>{}