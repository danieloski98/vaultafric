import { Module } from '@nestjs/common';
import { OnePipeService } from './one-pipe.service';
import { HttpModule } from '@nestjs/axios';
import { OnePipeController } from './onepipe.controller';

@Module({
  imports: [HttpModule],
  controllers: [OnePipeController],
  providers: [OnePipeService],
  exports: [OnePipeService],
})
export class OnepipeModule {}
