import { BadRequestException } from '@nestjs/common';

export class InActiveInvestmentException extends BadRequestException {
  constructor() {
    super(undefined, `Inactive investment selected`);
  }
}