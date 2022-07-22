import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ReportController } from './controller/report/report.controller';
import { ReportRepository } from './repository/report-repository';
import { CrudService } from './services/crud/crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportRepository, UserRepository])],
  controllers: [ReportController],
  providers: [CrudService],
})
export class ReportModule {}
