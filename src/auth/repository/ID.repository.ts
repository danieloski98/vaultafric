import { EntityRepository, Repository } from 'typeorm';
import { IDEntity } from '../entity/GovernmentCert';

@EntityRepository(IDEntity)
export class IDRepository extends Repository<IDEntity> {}
