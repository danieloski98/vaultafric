import { BadRequestException } from '@nestjs/common';

export class DuplicateJointSavingsException extends BadRequestException {
  constructor() {
    super(undefined, `Duplicate Joint Savings found`);
  }
}