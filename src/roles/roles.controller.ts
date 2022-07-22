import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/admin-auth/guards/auth.guard';
import { CreateRoleDTO } from './DTO/CreateRoleDTO';
import { RoleService } from './services/role';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RoleService) {}

  @ApiTags('ADMIN-ROLES')
  @Get()
  @UseGuards(AuthGuard)
  getRoles() {
    return this.roleService.getAllRole();
  }

  @ApiTags('ADMIN-ROLES')
  @ApiBody({ type: CreateRoleDTO })
  @UseGuards(AuthGuard)
  @Post()
  createRole(@Body() body: CreateRoleDTO) {
    return this.roleService.createRole(body);
  }

  @ApiTags('ADMIN-ROLES')
  @ApiParam({ name: 'id', type: String })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteRole(@Param() param: { id: string }) {
    return this.roleService.deleteRole(param.id);
  }
}
