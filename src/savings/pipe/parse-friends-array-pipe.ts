import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { InvalidFriendsValueException } from '../../exception/invalid-friends-value-exception';

export class ParseFriendsArrayPipe implements PipeTransform {
  
  transform(value: any, metadata: ArgumentMetadata): any {
    const error = new InvalidFriendsValueException();
    let participants;

    try{
      participants = JSON.parse(value.friends);
    }catch (e){
      throw error;
    }

    if(!(participants instanceof Array)) throw error;
    if(participants.length == 0) throw error;

    participants.forEach(p => {
      if(!p.id || !p.email) throw error;
    });

    value.participants = participants;
    return value;
  }

}