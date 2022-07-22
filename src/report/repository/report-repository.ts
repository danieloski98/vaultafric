import { EntityRepository, Repository } from 'typeorm';
import { ReportEntity } from '../entity/report';

@EntityRepository(ReportEntity)
export class ReportRepository extends Repository<ReportEntity> {}
