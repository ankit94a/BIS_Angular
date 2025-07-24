import { Injectable } from '@angular/core';
import { masterData } from '../model/masterdata.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataFilterService {
  constructor() { }

  getMasterData(masterDataList: masterData[]): { Header: string[], DataList: any[] } {
    const uniqueHeader = new Set<string>();

    const filteredData = masterDataList.map(item => {
      const reorderedItem: any = {};

      Object.keys(item).forEach(key => {
        if (item[key] != null && item[key] !== '') {
          const capitalizedKey = this.capitalizeFirstLetter(key);
          reorderedItem[capitalizedKey] = item[key];
          uniqueHeader.add(capitalizedKey);
        }
      });

      return reorderedItem;
    });

    return { Header: Array.from(uniqueHeader), DataList: filteredData };
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
