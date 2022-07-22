import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from 'src/admin-auth/entity/admin-repository';
import { RoleRepo } from './repository/role.repo';
import { RolesController } from './roles.controller';
import { RoleService } from './services/role';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([AdminRepository, RoleRepo])],
  providers: [RoleService],
})
export class RolesModule {}
