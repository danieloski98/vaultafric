import { EntityRepository, Repository } from 'typeorm';
import { IDEntity } from '../entities/ID.entity';

@EntityRepository(IDEntity)
export class IDRepository extends Repository<IDEntity> {}
