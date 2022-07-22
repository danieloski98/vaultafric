import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportDTO } from 'src/report/DTO/CreateReportDTO';
import { CrudService } from 'src/report/services/crud/crud.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: CrudService) {}

  @ApiTags('ADMIN-REPORT')
  @Get()
  getAllReports() {
    return this.reportService.getAllReports();
  }

  @ApiTags('ADMIN-REPORT')
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  getReport(@Param() param: { id: string }) {
    return this.reportService.getReport(param.id);
  }

  @ApiTags('ADMIN-REPORT')
  @ApiParam({ name: 'user_id', type: String })
  @Get('user-reports/:user_id')
  getUserReports(@Param() param: { user_id: string }) {
    return this.reportService.getAllReportsByUser(param.user_id);
  }

  @ApiTags('REPORT')
  @ApiBody({ type: CreateReportDTO })
  @Post()
  createReport(@Body() body: CreateReportDTO) {
    return this.reportService.createReport(body);
  }

  @ApiTags('ADMIN-REPORT')
  @ApiParam({ name: 'id', type: String })
  @Put('status/:id')
  changeStatus(@Param() param: { id: string }) {
    return this.reportService.changeStatus(param.id);
  }

  @ApiTags('ADMIN-REPORT')
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  deleteReport(@Param() param: { id: string }) {
    return this.reportService.deleteReport(param.id);
  }
}
