import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from './services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './entity/admin-repository';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRepository])],
  controllers: [AdminAuthController],
  providers: [AuthService],
})
export class AdminAuthModule {}
