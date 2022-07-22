import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminDto } from './DTO/admin-dto';
import { changePasswordDTO } from './DTO/ChangepasswordDTO';
import { AdminLoginDTO } from './DTO/LoginDto';
import { AdminSignUpDTO } from './DTO/SignupDTO';
import { UpdateDTO } from './DTO/UpdateDTO';
import { AuthGuard } from './guards/auth.guard';
import { AdminService } from './services/admin/admin.service';
import { AuthService } from './services/auth/auth.service';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {}

  @ApiTags('ADMIN-AUTH')
  @UseGuards(AuthGuard)
  @Get('admins')
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @ApiTags('ADMIN-AUTH')
  @ApiBody({ type: AdminSignUpDTO })
  @Post()
  createAdmin(@Body() body: AdminDto) {
    return this.authService.createAdminAccount(body);
  }

  @ApiTags('ADMIN-AUTH')
  @ApiBody({ type: AdminLoginDTO })
  @Post('login')
  loginadmin(@Body() body: AdminLoginDTO) {
    return this.authService.login(body);
  }

  @ApiTags('ADMIN-AUTH')
  @ApiParam({ type: String, name: 'id' })
  @Post('logout/:id')
  @UseGuards(AuthGuard)
  logout(@Param() param: { id: string }) {
    return this.authService.logout(param.id);
  }

  @ApiTags('ADMIN-AUTH')
  @UseInterceptors(FileInterceptor('avatar', { dest: 'admin-avatarts' }))
  @Put(':id/avatar')
  updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: { id: string },
  ) {
    return this.authService.updateAvatarImage(params.id, file);
  }

  @ApiTags('ADMIN-AUTH')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDTO })
  @UseGuards(AuthGuard)
  @Put('edit/:id')
  updateAdmin(@Body() body: UpdateDTO, @Param() param: { id: string }) {
    return this.adminService.updateAdminDetails(param.id, body);
  }

  @ApiTags('ADMIN-AUTH')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: changePasswordDTO })
  @UseGuards(AuthGuard)
  @Put('changepassword/:id')
  updatePassword(
    @Body() body: changePasswordDTO,
    @Param() param: { id: string },
  ) {
    return this.adminService.changePassword(param.id, body);
  }

  @ApiTags('ADMIN-AUTH')
  @ApiParam({ name: 'id', type: String })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteAdmin(@Param() param: { id: string }) {
    return this.adminService.deleteAdmin(param.id);
  }
}
