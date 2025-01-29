import { Injectable } from '@angular/core';
import { masterData } from '../model/masterdata.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataFilterService {
  constructor() { }

  getMasterData(masterDataList: masterData[]): { Header: string[], DataList: any[] } {
    const uniqueHeader = new Set<string>();

    // Reorder data and capture unique headers
    const filteredData = masterDataList.map(item => {
      const reorderedItem: any = {};

      Object.keys(item).forEach(key => {
        if (item[key] != null && item[key] !== '') {
          // Capitalize the first letter of the key and use it in the reorderedItem
          const capitalizedKey = this.capitalizeFirstLetter(key);
          reorderedItem[capitalizedKey] = item[key];
          uniqueHeader.add(capitalizedKey);
        }
      });

      return reorderedItem;
    });

    // Return the header (with capitalized first letter) and the filtered data
    return { Header: Array.from(uniqueHeader), DataList: filteredData };
  }

  // Function to capitalize the first letter of a string
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
