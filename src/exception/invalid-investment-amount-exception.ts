import { BadRequestException } from '@nestjs/common';

export class InvalidInvestmentAmountException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid investment amount`);
  }
}