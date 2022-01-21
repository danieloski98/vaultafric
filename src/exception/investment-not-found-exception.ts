import { NotFoundException } from '@nestjs/common';

export class InvestmentNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `Investment not found`);
  }
}