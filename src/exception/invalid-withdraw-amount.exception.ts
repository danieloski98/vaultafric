import { BadRequestException } from '@nestjs/common';

export class InvalidWithdrawAmountException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid withdraw amount`);
  }
}