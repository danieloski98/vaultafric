import { EntityRepository, Repository } from 'typeorm';
import { FixedSavings } from './fixed-savings.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { User } from '../../auth/entity/user.entity';

@EntityRepository(FixedSavings)
export class FixedSavingsRepository extends Repository<FixedSavings>{

  async newSavings(user: User, fixedSavingsDto: FixedSavingsDto): Promise<void> {
    const { name, start, end, occurrence, amount } = fixedSavingsDto;

    const fixedSavings = this.create({ name, start, end, occurrence, amount, user })
    await this.save(fixedSavings)
  }

}