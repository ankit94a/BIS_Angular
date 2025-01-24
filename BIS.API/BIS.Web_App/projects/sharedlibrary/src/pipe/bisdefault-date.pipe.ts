import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bisdefaultDate'
})
export class BisdefaultDatePipe extends DatePipe implements PipeTransform {

  override transform(value: Date): any {
    if (new Date(value).getFullYear() == 1) {
        return null;
    }
    else {
        let dateString = super.transform(value, 'dd MMM yyyy');
            return dateString;

    }
}
transformTime(value: Date, isDate): any {
    if (new Date(value).getFullYear() == 1) {
        return null;
    }
    else {
        let dateString = super.transform(value, 'dd MMM,yyyy, h:mm:ss a');
        if (isDate) {
            if (dateString == undefined || dateString == null) {
                return null;
            }
            return new Date(dateString);
        }
        else {
            return dateString;
        }
    }
}

}
