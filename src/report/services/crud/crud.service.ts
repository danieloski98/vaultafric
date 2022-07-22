import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateReportDTO } from 'src/report/DTO/CreateReportDTO';
import { REPORT_STATUS } from 'src/report/entity/report';
import { ReportRepository } from 'src/report/repository/report-repository';

@Injectable()
export class CrudService {
  private logger = new Logger(CrudService.name);

  constructor(
    @InjectRepository(ReportRepository) private reportRepo: ReportRepository,
    @InjectRepository(User) private userRepo: UserRepository,
  ) {}

  async createReport(payload: CreateReportDTO) {
    const exist = await this.userRepo.find({
      where: { id: payload.user_id },
    });

    if (exist === undefined) {
      throw new BadRequestException('User not found');
    }
    await this.reportRepo.save(payload);

    return {
      message: 'Report recieved',
    };
  }

  async getReport(id: string) {
    const report = await this.reportRepo.find({
      where: { id },
      relations: ['user'],
    });
    this.logger.error(report);
    if (report.length < 1) {
      throw new BadRequestException('REPORT NOT FOUND');
    }

    return {
      message: 'Reports returned',
      data: report,
    };
  }

  async getAllReportsByUser(user_id: string) {
    const reports = await this.reportRepo.find({
      where: { user_id },
    });

    return {
      message: 'Reports returned',
      data: reports,
    };
  }

  async getAllReports() {
    const reports = await this.reportRepo.find({
      relations: ['user'],
    });

    return {
      message: 'Reports returned',
      data: reports,
    };
  }

  async deleteReport(id: string) {
    const report = await this.reportRepo.delete({ id });
    this.logger.error(report);
    if (report.affected < 1) {
      throw new BadRequestException('REPORT NOT DELETED, TRY AGAIN');
    }

    return {
      message: 'Reports deleted',
    };
  }

  async changeStatus(id: string) {
    const report = await this.reportRepo.find({ where: { id } });

    if (report.length < 1) {
      throw new BadRequestException('REPORT NOT FOUND');
    }
    if (report[0].status === 2) {
      return {
        message: 'REPORT ALREADY FIXED',
      };
    }
    await this.reportRepo.update({ id }, { status: REPORT_STATUS.FIXED });

    return {
      message: 'CHANGED STATUS TO FIXED',
    };
  }
}
