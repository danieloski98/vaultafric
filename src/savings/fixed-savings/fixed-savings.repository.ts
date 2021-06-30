import { EntityRepository, Repository } from 'typeorm';
import { FixedSavings } from './fixed-savings.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { User } from '../../auth/user.entity';

@EntityRepository(FixedSavings)
export class FixedSavingsRepository extends Repository<FixedSavings>{

  async newSavings(user: User, fixedDepositDto: FixedSavingsDto) {
    const { name, start, end, occurrence, amount } = fixedDepositDto;

    const fixedDeposit = new FixedSavings();
    fixedDeposit.name = name;
    fixedDeposit.start = start;
    fixedDeposit.end = end;
    fixedDeposit.amount = amount;
    fixedDeposit.occurrence = occurrence;
    fixedDeposit.user = user;

    await fixedDeposit.save();
  }

  getAllSavings(userId: string): Promise<FixedSavings[]> {
    const query = this.createQueryBuilder('fs');
    query.where('fs.userId = :userId', { userId });
    query.andWhere('fs.isActive = :active', {active: true});
    return query.getMany();
  }

  getSavings(userId: string, id: string): Promise<FixedSavings> {
    const query = this.createQueryBuilder('fs');
    query.where('fs.id = :id', {id});
    query.andWhere('fs.userId = :userId', {userId});
    return query.getOneOrFail();
  }

  getCompletedSavings(userId: string) {
    const query = this.createQueryBuilder('fs');
    query.where('fs.userId = :userId', { userId });
    query.andWhere('fs.isCompleted = :completed', {completed: true});
    return query.getMany();
  }
}