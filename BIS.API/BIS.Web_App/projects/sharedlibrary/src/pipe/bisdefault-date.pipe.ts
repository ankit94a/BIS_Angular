import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bisdefaultDate'
})
export class BisdefaultDatePipe extends DatePipe implements PipeTransform {

  override transform(value: Date | string): any {

    if (!value) {
        return null;
    }

    if (typeof value === 'string' && value.match(/^Week \d{1,2}, \d{4}$/)) {
        return value; 
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return null; 
    }

    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}$/)) {
        return super.transform(date, 'MMM yyyy'); 
    }

    if (date.getFullYear() === 1) {
        return null;
    }

    return super.transform(date, 'dd MMM yyyy');
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
