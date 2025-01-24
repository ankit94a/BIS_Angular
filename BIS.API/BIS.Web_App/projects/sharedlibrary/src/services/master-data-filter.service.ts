import { Injectable } from '@angular/core';
import { masterData } from '../model/masterdata.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataFilterService {

  constructor() { }

  // getTableHeader(masterDataList: masterData[]) {
  //   // holds unique header;
  //   let uniqueHeader = new Set();
  //   masterDataList.forEach(item => {
  //     const keys = Object.keys(item);
  //     keys.forEach(key => {
  //       if (item[key] != null && item[key] !== "") {
  //         uniqueHeader.add(key);
  //       }
  //     });
  //   });
  //   this.tableHeader = [...uniqueHeader];
  //   return this.tableHeader;
  // }
  // getTableData(masterDataList: masterData[]) {
  //   this.masterDataList = masterDataList.map(item => {
  //     let reorderedItem = {};
  //     this.tableHeader.forEach(key => {
  //       if (item[key] != null && item[key] !== "") {
  //         reorderedItem[key] = item[key];
  //       }
  //     });
  //     return reorderedItem;
  //   });
  // }

  getMasterData(masterDataList: masterData[]): { Header: string[], DataList: any[] } {
    const uniqueHeader = new Set<string>();
    const filteredData = masterDataList.map(item => {
      const reorderedItem: any = {};
      Object.keys(item).forEach(key => {
        if (item[key] != null && item[key] !== '') {
          reorderedItem[key] = item[key];
          uniqueHeader.add(key);
        }
      });
      return reorderedItem;
    });
    return { Header:  Array.from(uniqueHeader), DataList: filteredData };
  }
}
