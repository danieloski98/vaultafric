import { EntityRepository, Repository } from 'typeorm';
import { JointSavingsEntity } from './joint-savings.entity';

@EntityRepository(JointSavingsEntity)
export class JointSavingsRepository extends Repository<JointSavingsEntity> {}