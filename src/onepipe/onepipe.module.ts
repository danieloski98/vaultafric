import { Module } from '@nestjs/common';
import { OnePipeService } from './one-pipe.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OnePipeService],
  exports: [OnePipeService],
})
export class OnepipeModule {}
