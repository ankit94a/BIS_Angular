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

    // If the value is a string and matches "Week XX, YYYY", return as it is
    if (typeof value === 'string' && value.match(/^Week \d{1,2}, \d{4}$/)) {
        return value; // Return "Week 11, 2024" as-is
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return null; // Invalid date, return null
    }

    // Check if the value is in "YYYY-MM" format
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}$/)) {
        return super.transform(date, 'MMM yyyy'); // Format as "Mar 2024"
    }

    // If the year is 1 (invalid date scenario)
    if (date.getFullYear() === 1) {
        return null;
    }

    // Default transformation: "dd MMM yyyy"
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
