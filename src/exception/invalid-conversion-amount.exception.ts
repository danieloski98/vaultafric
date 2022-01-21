import { BadRequestException } from '@nestjs/common';

export class InvalidConversionAmountException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid conversion amount`);
  }
}