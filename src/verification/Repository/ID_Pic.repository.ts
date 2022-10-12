import { EntityRepository, Repository } from 'typeorm';
import { GovernmentIDEntity } from '../entities/ID_Pic.entity';

@EntityRepository(GovernmentIDEntity)
export class ID_PicRepository extends Repository<GovernmentIDEntity> {}
