import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slicePairs'
})
export class SlicePairsPipe implements PipeTransform {
  transform(value: any[]): any[][] {
    const result = [];
    for (let i = 0; i < value.length; i += 2) {
      result.push(value.slice(i, i + 2));
    }
    return result;
  }
}
