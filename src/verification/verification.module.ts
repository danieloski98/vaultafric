import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDRepository } from './Repository/ID.repository';
import { ID_PicRepository } from './Repository/ID_Pic.repository';
import { VerificationController } from './verification.controller';
import { UserService } from './services/user/user.service';
import { AdminService } from './services/admin/admin.service';
import { UserRepository } from 'src/auth/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([IDRepository, ID_PicRepository, UserRepository]),
  ],
  controllers: [VerificationController],
  providers: [UserService, AdminService],
})
export class VerificationModule {}
