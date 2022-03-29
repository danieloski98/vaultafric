import { BadRequestException } from '@nestjs/common';

export class JointSavingsNotStartedException extends BadRequestException {
  constructor(objectOrError:any) {
    super(objectOrError);
  }
}