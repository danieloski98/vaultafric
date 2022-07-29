import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from 'src/auth/repository/profile.repository';
import { UserRepository } from 'src/auth/repository/user.repository';
import { UserController } from './controller/user/user.controller';
import { CrudService } from './services/crud/crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, ProfileRepository])],
  controllers: [UserController],
  providers: [CrudService],
})
export class UserModule {}
