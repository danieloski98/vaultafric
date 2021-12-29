import { Otp } from '../entity/otp.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Otp)
export class OtpRepository extends Repository<Otp> {}