import {
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  Param,
  Post, UploadedFile,
  UseGuards, UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { NewUserInvestmentDto } from './dto/new-user-investment.dto';
import { InvestmentService } from './investment.service';
import { RegisterInvestmentDto } from './dto/register-investment.dto';
import { ParseDatePipe } from '../savings/pipe/ParseDate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseInvestmentIntPipe } from './pipe/parse-investment-int.pipe';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('investment')
export class InvestmentController {

  constructor(private investmentService: InvestmentService) {}

  @HttpCode(HttpStatus.OK )
  @Post()
  invest(@GetUser() user: User,
         @Body(new ValidationPipe({transform: true})) newUserInvestmentDto: NewUserInvestmentDto) {
    return this.investmentService.invest(user, newUserInvestmentDto);
  }

  @Get()
  getInvestments() {
    return this.investmentService.getAllInvestments();
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Post('register')
  createNewInvestment(
    @Body(ParseInvestmentIntPipe, ParseDatePipe, new ValidationPipe({transform: true})) registerInvestmentDto: RegisterInvestmentDto,
    @UploadedFile() file: Express.Multer.File) {
    return this.investmentService.createInvestment(registerInvestmentDto, file?.buffer);
  }

  @Get(':id')
  getInvestmentById(@GetUser() user: User, @Param('id') id: string) {
    return this.investmentService.getInvestmentById(id);
  }

}
