import { Module } from '@nestjs/common';
import { UserprofileController } from './userprofile.controller';

@Module({
  controllers: [UserprofileController]
})
export class UserprofileModule {}
