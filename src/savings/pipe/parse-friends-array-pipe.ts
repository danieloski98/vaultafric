import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ParseFriendsArrayPipe implements PipeTransform {
  
  transform(value: any, metadata: ArgumentMetadata): any {
    value.participants = JSON.parse(value.friends);

    return value;
  }

}