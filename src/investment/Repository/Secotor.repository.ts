import { EntityRepository, Repository } from 'typeorm';
import { SectorEntity } from '../entity/Sector.entity';

@EntityRepository(SectorEntity)
export class SectorRepository extends Repository<SectorEntity> {}
