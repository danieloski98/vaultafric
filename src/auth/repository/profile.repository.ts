import { EntityRepository, Repository } from 'typeorm';
import { ProfileEntity } from '../entity/profile.entity';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends Repository<ProfileEntity> {}