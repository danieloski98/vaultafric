import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { NewUserInvestmentDto } from './dto/new-user-investment.dto';
import { InvestmentService } from './investment.service';
import { UserInvestmentEntity } from './user-investment.entity';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('investment')
export class InvestmentController {

  constructor(private investmentService: InvestmentService) {}

  @Post()
  invest(@GetUser() user: User, newUserInvestmentDto: NewUserInvestmentDto): Promise<void> {
    return this.investmentService.invest(user, newUserInvestmentDto);
  }

  @Get(':id')
  getInvestmentById(@GetUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<UserInvestmentEntity> {
    return this.investmentService.getInvestmentById(id);
  }

}
