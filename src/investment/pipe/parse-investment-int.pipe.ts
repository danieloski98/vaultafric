import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseInvestmentIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { roi, units } = value;

    value.roi = +roi;
    value.units = +units;

    return value;
  }

}