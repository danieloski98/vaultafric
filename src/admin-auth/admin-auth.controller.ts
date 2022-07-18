import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminDto } from './DTO/admin-dto';
import { AdminSignUpDTO } from './DTO/SignupDTO';
import { AuthService } from './services/auth/auth.service';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('ADMIN-AUTH')
  @ApiBody({ type: AdminSignUpDTO })
  @Post()
  createAdmin(@Body() body: AdminDto) {
    return this.authService.createAdminAccount(body);
  }

  @ApiTags('ADMIN-AUTH')
  @UseInterceptors(FileInterceptor('avatar'))
  @Put(':id/avatar')
  updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: { id: string },
  ) {
    return this.authService.updateAvatarImage(params.id, file);
  }
}
