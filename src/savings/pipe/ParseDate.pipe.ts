import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { start, end } = value;

    value.start = new Date(start);
    value.end = new Date(end);

    return value;
  }

}