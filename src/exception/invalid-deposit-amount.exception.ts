import { BadRequestException } from '@nestjs/common';

export class InvalidDepositAmountException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid deposit amount`);
  }
}