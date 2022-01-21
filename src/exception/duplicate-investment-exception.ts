import { BadRequestException } from '@nestjs/common';

export class DuplicateInvestmentException extends BadRequestException {
  constructor() {
    super(undefined, `Duplicate investment found`);
  }
}