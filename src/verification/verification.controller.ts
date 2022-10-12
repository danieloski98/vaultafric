import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ID_DTO } from './DTO/ID.DTO';
import { AdminService } from './services/admin/admin.service';
import { UserService } from './services/user/user.service';

@Controller('verification')
export class VerificationController {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  @ApiTags('VERIFICATION')
  @ApiBody({ type: ID_DTO })
  @ApiParam({ name: 'user_id', type: String })
  @Put('id/number/:user_id')
  uploadNumber(@Param() param: { user_id: string }, @Body() body: ID_DTO) {
    return this.userService.uploadIDNumber(param.user_id, body);
  }

  @ApiTags('VERIFICATION')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        back: { type: 'string', format: 'binary' },
        front: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'user_id', type: String })
  @ApiParam({
    type: String,
    name: 'type',
    description: 'The type of the Doc image been sent eg NIN, Drivers Licence',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'front', maxCount: 1 },
        { name: 'back', maxCount: 1 },
      ],
      { dest: 'Government_Doc' },
    ),
  )
  @Put('id/:type/:user_id')
  uploadIDimage(
    @Param() param: { user_id: string; type: string },
    @UploadedFiles()
    files: {
      front?: Express.Multer.File[];
      back?: Express.Multer.File[];
    },
  ) {
    return this.userService.uploadIDImage(param.user_id, param.type, files);
  }

  @ApiTags('VERIFICATION')
  @ApiParam({ name: 'id', type: String })
  @Put('/admin/approveNumber/:id')
  approveNumber(@Param() param: { id: string }) {
    return this.adminService.approvedNumber(param.id);
  }

  @ApiTags('VERIFICATION')
  @ApiParam({ name: 'id', type: String })
  @Put('/admin/approveDoc/:id')
  approveImage(@Param() param: { id: string }) {
    return this.adminService.approvedImage(param.id);
  }

  @ApiTags('VERIFICATION')
  @ApiParam({ name: 'id', type: String })
  @Delete('/admin/declineNumber/:id')
  deleteNumber(@Param() param: { id: string }) {
    return this.adminService.deleteNumber(param.id);
  }

  @ApiTags('VERIFICATION')
  @ApiParam({ name: 'id', type: String })
  @Delete('/admin/declineDoc/:id')
  deleteDoc(@Param() param: { id: string }) {
    return this.adminService.deleteImage(param.id);
  }
}
