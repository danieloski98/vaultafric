import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardRepository } from './card-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository]),
    AuthModule
  ],
  controllers: [CardController],
  providers: [CardService]
})
export class CardModule {}
