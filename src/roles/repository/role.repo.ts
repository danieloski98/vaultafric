import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/role';

@EntityRepository(Role)
export class RoleRepo extends Repository<Role> {
  private readonly logger = new Logger(RoleRepo.name);

  async roleExist(role: string) {
    const exist = await this.find({
      where: { role },
    });
    console.log(exist);
    if (exist.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getAllRoles() {
    const roles = await this.find({});
    return roles;
  }
}
