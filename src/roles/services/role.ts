import { BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDTO } from '../DTO/CreateRoleDTO';
import { RoleRepo } from '../repository/role.repo';

export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(@InjectRepository(RoleRepo) private roleRepo: RoleRepo) {}

  async getAllRole() {
    const results = await this.roleRepo.getAllRoles();

    return {
      message: 'Role gotten',
      data: results,
    };
  }

  async createRole(role: CreateRoleDTO) {
    const exisit = await this.roleRepo.roleExist(role.role.toLocaleLowerCase());
    if (exisit) {
      throw new BadRequestException('Role already exists');
    }
    await this.roleRepo.create({ role: role.role.toLocaleLowerCase() }).save();

    return {
      message: `${role.role} role created`,
    };
  }

  async deleteRole(id: string) {
    const exist = await this.roleRepo.find({
      where: [{ id }],
    });

    if (exist.length < 1) {
      throw new BadRequestException('Role not found');
    }
    await this.roleRepo.delete({ id });

    return {
      message: 'Role deleted',
    };
  }
}
