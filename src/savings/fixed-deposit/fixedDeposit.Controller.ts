import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetUser } from '../../auth/get-user-decorator';
import { User } from '../../auth/entity/user.entity';
import { FixedSavings } from '../fixed-savings/fixed-savings.entity';
import { FixedSavingsDto } from '../fixed-savings/dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from '../fixed-savings/dto/updated-fixed-savings.dto';
import { DeleteFixedSavingsDto } from '../fixed-savings/dto/delete-fixed-savings.dto';
import { FixedSavingsService } from '../fixed-savings/fixed-savings.service';

@Controller('fixed-deposit')
export class FixedDepositController {
  constructor(
  ) {
  }


}