import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isCurrentUser'
})
export class IsCurrentUserPipe implements PipeTransform {

  transform(arrayItem,currentUserId:number): unknown {
    if(arrayItem.createdBy !== currentUserId){
      return '<button>Add Reference</button>'
    }
    return null;
  }

}
