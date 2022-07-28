import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudService } from 'src/user/services/crud/crud.service';

@Controller('user')
export class UserController {
  constructor(private crudService: CrudService) {}

  @ApiTags('ADMIN-USER')
  @Get()
  getUsers() {
    return this.crudService.getAllUSers();
  }
}
