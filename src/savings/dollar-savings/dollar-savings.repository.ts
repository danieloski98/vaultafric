import { EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { DollarSavingsEntity } from './dollar-savings.entity';

@EntityRepository(DollarSavingsEntity)
export class DollarSavingsRepository extends Repository<DollarSavingsEntity>{

  @PrimaryGeneratedColumn('uuid')
  id: string;

}