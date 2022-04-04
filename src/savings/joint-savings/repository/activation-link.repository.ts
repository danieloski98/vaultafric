import { ActivationLink } from '../entity/activation-link.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ActivationLink)
export class ActivationLinkRepository extends Repository<ActivationLink>{}